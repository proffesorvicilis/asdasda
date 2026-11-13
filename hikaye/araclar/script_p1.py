import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-asdasda/5ad55278-9698-52a9-9eb7-f75a6ec961aa/scratchpad')
from prod import render_part
P1=[
 {'sp':'KIZ','seg':["[sobbing] [panicked] Alo? Lütfen biri yardım etsin! Uçak düşecek! Herkes uyuyor!"]},
 {'sp':'PROFESÖR','seg':["[calm] Seni duyuyorum. Ben buradayım. Neredesin sen?"]},
 {'sp':'KIZ','seg':["[crying] Uçaktayım! Kimse uyanmıyor!"]},
 {'sp':'PROFESÖR','seg':["[firm] Tuna."],'gap':0.12},
 {'sp':'PROFESÖR','seg':["[gently] Tamam. Kapatmıyorum. Kimle uçuyorsun?"]},
 {'sp':'KIZ','seg':["[sniffles] [quietly] Yalnızım..."]},
 {'sp':'PROFESÖR','seg':["[softly] Kaç yaşındasın?"]},
 {'sp':'KIZ','seg':["[sniffles] Yedi."]},
 {'sp':'PROFESÖR','seg':["[focused] Pilotlar nerede?"]},
 {'sp':'KIZ','seg':["[scared] Kokpitin kapısı açık... İkisi de uyuyor. Seslendim, uyanmadılar."]},
 {'sp':'PROFESÖR','seg':["[gently] Nereye gidiyordunuz?"]},
 {'sp':'KIZ','seg':["[quietly] Eve..."]},
 {'sp':'PROFESÖR','seg':["[softly] Ev nerede?"]},
 {'sp':'KIZ','seg':["[crying] Bilmiyorum..."]},
 {'sp':'PROFESÖR','seg':["[calm] Pencereden bakabilir misin? Dışarıda ne görüyorsun?"]},
 {'sp':'KIZ','seg':["[whispers] Hiçbir şey... Kapkaranlık."]},
 {'sp':'KIZ','seg':["[screaming] Uçak sallanıyor! Korkuyorum!"]},
 {'sp':'PROFESÖR','seg':["[softly] [warmly] Biliyorum. Ben de korkardım. Ama sesimi duyuyorsun, değil mi? Ben buradayım."]},
 {'sp':'KIZ','seg':["[sniffles] Duyuyorum..."]},
 {'sp':'PROFESÖR','seg':["[curious] Bu numarayı nereden buldun?"]},
 {'sp':'KIZ','seg':["[sniffles] Koltuğun cebinde bir telefon vardı. Yanında da bir kâğıt. \"Uçak düşerse Profesörü ara\" yazıyor."]},
 {'sp':'ÖMER','seg':["[whispers] O ismi bu odanın dışında kimse bilmez."],'gap':0},
]
import prod; prod.FORCE={"p1_14_0"}; render_part(1,P1)
