import json, subprocess, os, sys, re
sys.path.insert(0,'/tmp/claude-0/-home-user-asdasda/5ad55278-9698-52a9-9eb7-f75a6ec961aa/scratchpad')
from gen import tts, stt, norm, trim
import difflib
S='/tmp/claude-0/-home-user-asdasda/5ad55278-9698-52a9-9eb7-f75a6ec961aa/scratchpad'
ROOT='/home/user/asdasda/hikaye/ses'
V={'KIZ':('Hr3W7yWIljG9YBJn39oK',0.0,True),'PROFESÖR':('DsbR47WNEv8o9x37ib9X',0.5,False),
   'BORA':('euBhqSy9BY3XHNLwxF7J',0.5,False),'TUNA':('qLctY6uJSzrtjp23kPzO',0.5,False),
   'ÖMER':('E38heb42yln7Ox5qE9i9',0.5,False),'KADIN':('gXhtBWsl0fhuAbNHKhjA',0.0,True)}
SLUG={'KIZ':'kiz','PROFESÖR':'profesor','BORA':'bora','TUNA':'tuna','ÖMER':'omer','KADIN':'saadet'}
PHONE="highpass=f=300,lowpass=f=3400,acompressor=threshold=0.1:ratio=3:attack=5:release=60,volume=1.6"
COMPRESS="silenceremove=stop_periods=-1:stop_duration=0.15:stop_threshold=-45dB:stop_silence=0.12"
FORCE=set()
SAD=re.compile(r'crying|sobbing|scared|panicked|screaming|sniffles|desperate|terrified|whispers|quietly')
LAUGH=re.compile(r'\[(güler|gülme|gülüyor|kahkaha|laugh)',re.I)
def ok_text(exp,got):
    if SAD.search(exp) and LAUGH.search(got): return False,0.0
    e,g=norm(exp),norm(got)
    if not e: return True,1.0
    r=difflib.SequenceMatcher(None,e,g).ratio()
    if len(e)==1: return (g==e), r
    if len(e)==2: return (r>=0.5 or all(w in g for w in e)), r
    return r>=0.8, r
import glob
def gen_segment(key,speaker,text,stab,retries=3):
    vid=V[speaker][0]; best=None
    prev=sorted(glob.glob(f'{S}/prod/{key}_[0-9].wav'),key=lambda x:int(x.rsplit('_',1)[1].split('.')[0]))
    if prev and key not in FORCE:
        w=prev[-1]; c=w.replace('.wav','_c.wav')
        subprocess.run(['ffmpeg','-v','error','-y','-i',w,'-af',COMPRESS,c],check=True)
        print(f'   {key} kayıttan',flush=True); return c,1.0,'(kayıt)'
    start=(int(prev[-1].rsplit('_',1)[1].split('.')[0])+1) if prev else 0
    for a in range(start,start+retries+1):
        raw=f'{S}/prod/{key}_{a}.mp3'; w0=f'{S}/prod/{key}_{a}.wav'; wav=f'{S}/prod/{key}_{a}_c.wav'
        tts(vid,text,stab,raw); trim(raw,w0)
        subprocess.run(['ffmpeg','-v','error','-y','-i',w0,'-af',COMPRESS,wav],check=True)
        got=stt(wav); ok,r=ok_text(text,got)
        print(f'   {key} d{a} uyum={r:.2f} {"OK" if ok else "TEKRAR"} :: {got[:80]}',flush=True)
        if best is None or r>best[1]: best=(wav,r,got)
        if ok: return wav,r,got
    return best
def static(path,d=0.45):
    subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i',f'anoisesrc=d={d}:c=white:a=0.22:r=44100','-af',f'highpass=f=700,lowpass=f=5000,afade=t=in:d=0.02,afade=t=out:st={d-0.12}:d=0.12','-ac','1',path],check=True)
def silence(path,d):
    subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i',f'anullsrc=r=44100:cl=mono','-t',str(d),path],check=True)
def dur(p): return float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p],capture_output=True,text=True).stdout)
def render_part(n,lines):
    os.makedirs(f'{S}/prod',exist_ok=True); outdir=f'{ROOT}/part{n}'; os.makedirs(outdir,exist_ok=True)
    timeline=[]; seq=[]; t=0.0; report=[]
    for i,L in enumerate(lines,1):
        if L.get('static'):
            p=f'{S}/prod/p{n}_static_{i}.wav'; static(p,L.get('d',0.45)); seq.append(p); d=dur(p)
            timeline.append((t,t+d,'—','(hat cızırtısı)')); t+=d
            if L.get('gap'):
                gp=f'{S}/prod/gap_{L["gap"]}.wav'; silence(gp,L['gap']); seq.append(gp); t+=L['gap']
            continue
        sp=L['sp']; vid,stab,phone=V[sp]; wavs=[]
        for j,seg in enumerate(L['seg']):
            w,r,got=gen_segment(f'p{n}_{i:02d}_{j}',sp,seg,stab); wavs.append(w); report.append((i,sp,seg,r,got))
        # aynı replik içindeki parçaları 0.12 sn boşlukla birleştir
        line_wav=f'{S}/prod/p{n}_line_{i:02d}.wav'
        if len(wavs)==1: subprocess.run(['cp',wavs[0],line_wav],check=True)
        else:
            gp=f'{S}/prod/gap012.wav'; silence(gp,0.12); lst=[]
            for k,w in enumerate(wavs):
                lst.append(w)
                if k<len(wavs)-1: lst.append(gp)
            cf=f'{S}/prod/p{n}_l{i}.txt'; open(cf,'w').write(''.join(f"file '{x}'\n" for x in lst))
            subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',cf,'-c','pcm_s16le',line_wav],check=True)
        if L.get('cut_word'):
            r=subprocess.run(['curl','-sS','-X','POST','https://api.elevenlabs.io/v1/speech-to-text','-F','model_id=scribe_v1','-F','language_code=tur','-F','timestamps_granularity=word','-F',f'file=@{line_wav}'],capture_output=True,text=True)
            words=[w for w in json.loads(r.stdout).get('words',[]) if w.get('type')=='word']
            tgt=[w for w in words if norm(w['text'])==norm(L['cut_word'])]
            if tgt:
                cut=tgt[-1]['start']+L.get('cut_after',0.12); cw=line_wav.replace('.wav','_cut.wav')
                subprocess.run(['ffmpeg','-v','error','-y','-i',line_wav,'-t',f'{cut:.3f}','-af',f'afade=t=out:st={max(cut-0.015,0):.3f}:d=0.015',cw],check=True)
                print(f'   kesildi: "{L["cut_word"]}" {cut:.2f} sn',flush=True); line_wav=cw
            else: print('   UYARI: kesilecek kelime bulunamadı:',[w['text'] for w in words])
        if phone:
            ph=line_wav.replace('.wav','_tel.wav'); subprocess.run(['ffmpeg','-v','error','-y','-i',line_wav,'-af',PHONE,ph],check=True); line_wav=ph
        mp3=f'{outdir}/{i:02d}_{SLUG[sp]}.mp3'
        subprocess.run(['ffmpeg','-v','error','-y','-i',line_wav,'-c:a','libmp3lame','-b:a','160k',mp3],check=True)
        d=dur(line_wav); seq.append(line_wav)
        timeline.append((t,t+d,sp,' / '.join(re.sub(r'\[[^\]]*\]\s*','',s) for s in L['seg']))); t+=d
        g=L.get('gap',0.18)
        if g>0:
            gp=f'{S}/prod/gap_{g}.wav'; silence(gp,g); seq.append(gp); t+=g
    cf=f'{S}/prod/part{n}_list.txt'; open(cf,'w').write(''.join(f"file '{x}'\n" for x in seq))
    full=f'{ROOT}/part{n}_tam.mp3'
    subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',cf,'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','44100','-c:a','libmp3lame','-b:a','192k',full],check=True)
    md=[f'# Part {n} · Ses zamanlaması\n',f'Toplam süre: **{dur(full):.1f} sn** · Dosya: `part{n}_tam.mp3` · Tek tek replikler: `part{n}/`\n','| # | Başlangıç | Bitiş | Kim | Replik |','|---|---|---|---|---|']
    for k,(a,b,sp,txt) in enumerate(timeline,1): md.append(f'| {k} | {a:5.2f} | {b:5.2f} | {sp} | {txt} |')
    open(f'{ROOT}/part{n}_zamanlama.md','w').write('\n'.join(md)+'\n')
    low=[x for x in report if x[3]<0.8]
    print(f'PART {n} bitti: {dur(full):.1f} sn, {len(report)} parça, düşük uyum: {len(low)}')
    for x in low: print('   DÜŞÜK:',x[0],x[1],round(x[3],2),'|',x[2][:60],'=>',x[4][:60])
