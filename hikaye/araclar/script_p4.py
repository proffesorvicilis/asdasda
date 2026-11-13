import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-asdasda/5ad55278-9698-52a9-9eb7-f75a6ec961aa/scratchpad')
from prod import render_part
P4=[
 {'sp':'PROFESÖR','seg':["[thoughtful] Dokuz kardeş, denizin ortasında... Adalar."]},
 {'sp':'TUNA','seg':["[focused] Adalar dokuz tane. En büyüğü Büyükada."]},
 {'sp':'PROFESÖR','seg':["[thoughtful] Ne en büyük ne en küçük. Geriye yedi ada kalıyor."]},
 {'sp':'BORA','seg':["[impatient] Hangisi?"]},
 {'sp':'PROFESÖR','seg':["[slowly] Sırtında yük taşıyan... Yük...","[excited] Heybe. Heybeliada."]},
 {'sp':'ÖMER','seg':["[serious] Ada büyük. Kadın adanın neresinde?"]},
 {'sp':'PROFESÖR','seg':["[fast] [confident] Mesajda vapur düdüğü vardı. Martılar, rüzgar. İskele. Heybeliada iskelesi."]},
 {'sp':'ÖMER','seg':["[suspicious] Gülümsüyorsun."]},
 {'sp':'PROFESÖR','seg':["[cold] Hayır."],'gap':0.35},
 {'sp':'PROFESÖR','seg':["[firm] Heybeliada. İskele."],'gap':0.2},
 {'sp':'KADIN','seg':["[crying] [reading word by word] Dokuz dakika... Profesörcüğüm. [sniffles] Eskiden... üç dakikada çözerdin. İlk rakam... sıfır."],'gap':0.1},
 {'sp':'KADIN','seg':["[desperate] [shouting] O gece çayı o verdi! Hepimiz uyuduk! Ela'yı bırakmamalıydık!"],'gap':0.15},
 {'sp':'KADIN','seg':["[terrified] [reading slowly] Fazla... konuştun... Saadet."],'gap':0},
 {'static':True,'d':0.6,'gap':0.4},
 {'sp':'PROFESÖR','seg':["[whispers] Ela..."],'gap':0},
]
import prod
from gen import norm
_orig=prod.ok_text
def strict(exp,got):
    ok,r=_orig(exp,got)
    if "Ada büyük" in exp: ok = ok and norm(got)[:2]==["ada","buyuk"]
    return ok,r
prod.ok_text=strict; prod.FORCE={"p4_06_0"}
render_part(4,P4)
