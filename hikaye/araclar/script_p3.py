import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-asdasda/5ad55278-9698-52a9-9eb7-f75a6ec961aa/scratchpad')
from prod import render_part
P3=[
 {'sp':'KADIN','seg':["[crying] [reading slowly from a paper, word by word] Kızla... tanıştın. [sniffles] Tatlı... değil mi?"],'gap':0.3},
 {'sp':'KADIN','seg':["[crying] [reading word by word] Telefonu... bırak... savcı bey. [gasps] Polis... zaten benim."],'gap':0.35},
 {'sp':'KADIN','seg':["[crying] [reading slowly from a paper] Kurallar... basit. Ben sorarım... sen çözersin. [sniffles] Çözene kadar... kızla konuşamazsın. Her doğru cevap... bir rakam."],'gap':0.15},
 {'sp':'KADIN','seg':["[sobbing] [desperate] Lütfen... torunlarım evde yalnız..."],'gap':0.2},
 {'sp':'KADIN','seg':["[crying] [reading word by word] Birinci bilmece. [sniffles] Dokuz kardeşiz... denizin ortasında. Ne en büyüğüyüm... ne en küçüğü. Sırtımda... yük taşırım.",
                     "[sobbing] [reading slowly from a paper] Bu hanımefendi... neredeyse... orası. Kırk dakika. Cevabı bulunca... beni ara.",
                     "[crying] [reading word by word] Tik... tak. [sniffles] Tik... tak."],'gap':0},
 {'static':True,'d':0.35},
 {'sp':'TUNA','seg':["[tense] Numara hiçbir yere kayıtlı değil."]},
 {'sp':'BORA','seg':["[low] Kırk dakika."]},
 {'sp':'PROFESÖR','seg':["[cold] Sus. Düşünüyorum."],'gap':0},
]
render_part(3,P3)
