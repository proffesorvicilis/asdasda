import json, subprocess, os, re, unicodedata
S='/tmp/claude-0/-home-user-asdasda/5ad55278-9698-52a9-9eb7-f75a6ec961aa/scratchpad'
TRIM="silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse"
def tts(vid,text,stab,out,model='eleven_v3'):
    body={'text':text,'model_id':model,'language_code':'tr','voice_settings':{'stability':stab}}
    r=subprocess.run(['curl','-sS','-o',out,'-w','%{http_code}','-X','POST',f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128','-H','Content-Type: application/json','--data-binary',json.dumps(body,ensure_ascii=False)],capture_output=True,text=True)
    if r.stdout!='200': raise RuntimeError(f'TTS {r.stdout}: {open(out,"rb").read()[:200]}')
def stt(path):
    r=subprocess.run(['curl','-sS','-X','POST','https://api.elevenlabs.io/v1/speech-to-text','-F','model_id=scribe_v1','-F','language_code=tur','-F',f'file=@{path}'],capture_output=True,text=True)
    return json.loads(r.stdout).get('text','')
def norm(s):
    s=re.sub(r'\[[^\]]*\]','',s).lower()
    s=s.replace('ı','i').replace('İ','i')
    s=unicodedata.normalize('NFKD',s); s=''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'[^a-z0-9 ]',' ',s).split()
def wer_ok(expected,got,tol=0.2):
    e,g=norm(expected),norm(got)
    import difflib
    sm=difflib.SequenceMatcher(None,e,g); ratio=sm.ratio()
    return ratio>=1-tol, ratio
def trim(src,dst):
    subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-af',TRIM,'-ar','44100','-ac','1',dst],check=True)
def concat(wavs,out,gap=0.35):
    inputs=[]
    for p in wavs: inputs+=['-i',p]
    n=len(wavs); chain=''
    for j in range(n):
        chain+=f'[{j}:a]'
        if j<n-1: chain+=f'[g{j}]'
    gaps=''.join(f'aevalsrc=0:d={gap}:s=44100[g{j}];' for j in range(n-1))
    subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex',gaps+chain+f'concat=n={2*n-1}:v=0:a=1[o]','-map','[o]','-c:a','libmp3lame','-b:a','128k',out],check=True)
def make(name,vid,segments,outdir,verify=True,retries=2):
    """segments: list of (text, stability)"""
    os.makedirs(S+'/seg3',exist_ok=True); wavs=[]
    for i,(txt,stab) in enumerate(segments):
        for attempt in range(retries+1):
            raw=f'{S}/seg3/{name}_{i}_{attempt}.mp3'; wav=f'{S}/seg3/{name}_{i}.wav'
            tts(vid,txt,stab,raw); trim(raw,wav)
            if not verify: break
            got=stt(wav); ok,ratio=wer_ok(txt,got)
            print(f'  {name}[{i}] deneme{attempt} uyum={ratio:.2f} {"OK" if ok else "TEKRAR"} :: {got[:90]}')
            if ok: break
        wavs.append(wav)
    out=f'{outdir}/{name}.mp3'; concat(wavs,out); print(name,'->',out)
