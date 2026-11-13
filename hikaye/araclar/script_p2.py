import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-asdasda/5ad55278-9698-52a9-9eb7-f75a6ec961aa/scratchpad')
from prod import render_part
P2=[
 {'sp':'TUNA','seg':["[tense] Arama uçağın internetinden geliyor. Ama sinyal aynı anda İstanbul, Ankara ve Bakü'den geçirilmiş."]},
 {'sp':'PROFESÖR','seg':["[cold] Yani?"]},
 {'sp':'TUNA','seg':["[uneasy] Yani bunu yapan ya bir devlet... ya da devletin içindeki biri."]},
 {'sp':'ÖMER','seg':["[serious] Hava trafikle konuştum. Radarda kaybolan tek bir uçak yok."]},
 {'sp':'BORA','seg':["[low] Kız yalan mı söylüyor?"]},
 {'sp':'PROFESÖR','seg':["[confident] Hayır. Transponderi kapatmışlar. Uçak havada ama kimse göremiyor. Bu bir kaza değil."]},
 {'sp':'KIZ','seg':["[crying] Profesör? Gittin mi?"]},
 {'sp':'PROFESÖR','seg':["[gently] Buradayım. Hiçbir yere gitmiyorum. Bana bir şey söyle... En sevdiğin oyun ne?"]},
 {'sp':'KIZ','seg':["[sniffles] Uçak oyunu..."],'gap':0.3},
 {'sp':'KIZ','seg':["[scared] [quietly] Ama bu oyun değil, değil mi?"]},
 {'sp':'PROFESÖR','seg':["[softly] Değil. Ama seni eve götüreceğim. Söz veriyorum."]},
 {'sp':'BORA','seg':["[low] Uçağı şu an kim uçuruyor?"]},
 {'sp':'PROFESÖR','seg':["[grim] Otopilot... ve yedi yaşında bir kız."],'gap':0.15},
 {'sp':'PROFESÖR','seg':["[gently] Bana adını söyler misin?"]},
 {'sp':'KIZ','seg':["[softly] Benim adım Ela."],'cut_word':'Ela','cut_after':0.11,'gap':0},
 {'static':True,'d':0.5},
 {'sp':'KADIN','seg':["[crying] [reading slowly from a paper, word by word] Merhaba... Profesör. [sniffles] Uyuyamadın mı... yine? [sobbing] Ben... de."],'gap':0},
]
import prod; prod.FORCE={"p2_02_0"}; render_part(2,P2)
