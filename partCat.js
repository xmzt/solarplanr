//include part.js

//-----------------------------------------------------------------------------------------------------------------------
// Panel
//-----------------------------------------------------------------------------------------------------------------------

var PanelBoviet370 = new PanelPart()
    .cDesNickMakeModelMore('Boviet.370', 'Boviet', 'BVM6610M-370S-H-HC-BF', 'Panel')
    .cDimPanel(/*long*/179.4, /*short*/104.6, /*height*/3.5)
    .cClamp(/*long0*/27.0, /*long1*/35.5, /*short0*/20, /*short1*/30)
    .cElecPanel(/*watts*/370, /*voc*/38.00, /*isc*/9.27)
    .cWarranty('25/25')
    .nDs('https://bovietsolar.com/wp-content/uploads/Boviet-Solar_4.-Vega-Series_Mono_Bifacial_CI_PV-Module_Transparent-Back_360-370W_April2023.pdf')
    .nI('https://bovietsolar.com/wp-content/uploads/Boviet_Solar_Installation_Manual.pdf')
    .s1U(242.81, 'https://cedgreentech.com/');

var PanelBoviet370_libclamp = new PanelPart()
    .cDesNickMakeModelMore('Boviet.370', 'Boviet', 'BVM6610M-370S-H-HC-BF', 'Panel')
    .cDimPanel(/*long*/179.4, /*short*/104.6, /*height*/3.5)
    .cClamp(/*long0*/27.0, /*long1*/55.0, /*short0*/20, /*short1*/30)
    .cElecPanel(/*watts*/370, /*voc*/38.00, /*isc*/9.27)
    .cWarranty('25/25')
    .nDs('https://bovietsolar.com/wp-content/uploads/Boviet-Solar_4.-Vega-Series_Mono_Bifacial_CI_PV-Module_Transparent-Back_360-370W_April2023.pdf')
    .nI('https://bovietsolar.com/wp-content/uploads/Boviet_Solar_Installation_Manual.pdf')
    .s1U(242.81, 'https://cedgreentech.com/');

var PanelJa535 = new PanelPart()
    .cDesNickMakeModelMore('JA.535', 'JA', 'JAM72D30', 'Panel')
    .cDimPanel(/*long*/227.8, /*short*/113.4, /*height*/3.5) 
    .cClamp(/*long0*/52, /*long1*/62, /*short0*/25, /*short1*/35)
    .cElecPanel(/*watts*/535, /*voc*/49.45, /*isc*/13.79)  
    .cWarranty('25/25')
    .nDs('https://www.jasolar.com/uploadfile/2022/0511/20220511055529246.pdf')
    .nI('https://www.jasolar.com/uploadfile/2022/0218/20220218094918677.pdf')
    .s1U(361.00, 'https://www.solaris-shop.com/ja-solar-jam72d30-535-mb-535w-mono-bifacial-solar-panel/');

var PanelMse380 = new PanelPart()
    .cDesNickMakeModelMore('Mission.380', 'Misson Solar', 'MSE380SX5R', 'Panel')
    .cDimPanel(/*long*/190.7, /*short*/104.4, /*height*/4.0) 
    .cClamp(/*long0*/39, /*long1*/49, /*short0*/20, /*short1*/30)
    .cElecPanel(/*watts*/380, /*voc*/44.84, /*isc*/10.91)
    .cWarranty('25/25')
    .nDs('https://rexel-cdn.com/products/6.pdf?i=30E98CA0-6C44-4CBD-80F5-86889ABD2C48')
    .s1U(249.99, 'https://www.platt.com/p/2049931/mission-solar-energy/380w-solar-module-66-cell-black-on-black/msemse380sx5r');

var PanelMse420 = new PanelPart()
    .cDesNickMakeModelMore('Mission.420', 'Mission Solar', 'MSE420SX6W', 'Panel')
    .cDimPanel(/*long*/208.6, /*short*/105.4, /*height*/4.0)
    .cClamp(/*long0*/39, /*long1*/49, /*short0*/20, /*short1*/30)
    .cElecPanel(/*watts*/420, /*voc*/49.14, /*isc*/11.05)
    .cWarranty('25/25')
    .nDs('https://rexel-cdn.com/products/mse420sx6w.pdf?i=BC55BE43-0035-44AB-98B3-1489834CD83F')
    .s1U(235.00, 'https://www.platt.com/p/1965922/mission-solar-energy/420w-solar-module-72-cell-silver-on-white/msemse420sx6w');

var PanelQ475 = new PanelPart()
    .cDesNickMakeModelMore('Q.475', 'Q.Cells', 'Q.PEAK DUO XL-G10.c', 'Panel')
    .cDimPanel(/*long*/221.6, /*short*/104.5, /*height*/3.5)
    .cClamp(/*long0*/30, /*long1*/55, /*short0*/20, /*short1*/30)
    .cElecPanel(/*watts*/475, /*voc*/53.58, /*isc*/11.24)
    .cWarranty('25/25')
    .nDs('https://rexel-cdn.com/products/6.pdf?i=F7962CDC-0877-46BD-BF50-391892EB180C')
    .nI('https://www.q-cells.us/dam/jcr:b22b5dce-17da-432c-a58d-c63d959e75df/Q_CELLS_Installation_Manual_Q.PEAK_DUO_XL-G10.2_G10.c_modules_series_2021-07_Rev01_NA%20(2).pdf')
    .s1U(275.50, 'https://www.platt.com/p/2047104/q-cells/475w-solar-module-156-half-cell-black-aluminum/qclqpeakduoxlg1047');

var PanelQ400 = new PanelPart()
    .cDesNickMakeModelMore('Q.400', 'Q.Cells', 'Q.PEAK DUO BLK ML-G10+', 'Panel')
    .cDimPanel(/*long*/187.9, /*short*/104.5, /*height*/3.2) 
    .cClamp(/*long0*/20, /*long1*/65, /*short0*/20, /*short1*/30)
    .cElecPanel(/*watts*/400, /*voc*/45.30, /*isc*/11.14)
    .cWarranty('25/25')
    .nDs('https://rexel-cdn.com/products/6.pdf?i=6E8DE030-1C26-4F37-8226-E744C491CCCE')
    .nI('https://media.q-cells.com/v/eyEEJh2F/')
    .s1U(270.00, 'https://www.platt.com/p/2007167/q-cells/400w-solar-module-132-half-cell-black-aluminum/qclduoblkmlg10400w');

var PanelRec370 = new PanelPart()
    .cDesNickMakeModelMore('Rec.370', 'REC', 'REC370NP2 Black', 'Panel')
    .cDimPanel(/*long*/175.5, /*short*/104.0, /*height*/3.0)
    .cClamp(/*long0*/25.5, /*long1*/61.0, /*short0*/20.0, /*short1*/30.0)
    .cElecPanel(/*watts*/370, /*voc*/41.1, /*isc*/11.41)
    .cWarranty('20/25')
    .nDs('https://usa.recgroup.com/sites/default/files/documents/ds_rec_n-peak_2_black_series_en_us.pdf')
    .s1U(333.00, 'https://cedgreentech.com/');

var PanelRec405AA = new PanelPart()
    .cDesNickMakeModelMore('Rec.405', 'REC', 'REC405AA', 'Panel')
    .cDimPanel(/*long*/182.1, /*short*/101.6, /*height*/3.0)
    .cClamp(/*long0*/25.5, /*long1*/61.0, /*short0*/20.0, /*short1*/30.0)
    .cElecPanel(/*watts*/405, /*voc*/49.1, /*isc*/10.41)
    .cWarranty('25/25')
    .nDs('https://www.recgroup.com/sites/default/files/documents/ds_rec_alpha_pure_series_en_us.pdf')
    .nI('https://www.recgroup.com/sites/default/files/documents/im_rec_alpha_panels_en.pdf')
    .s1U(379.00, 'https://cedgreentech.com/');

var PanelSeg400 = new PanelPart()
    .cDesNickMakeModelMore('Seg.400', 'SEG', 'SEG-400-BMD-HV', 'Panel')
    .cDimPanel(/*long*/172.2, /*short*/113.4, /*height*/3.5)
    .cClamp(/*long0*/25.5, /*long1*/61.0, /*short0*/20.0, /*short1*/30.0)
    .cElecPanel(/*watts*/400, /*voc*/37.22, /*isc*/13.70)
    .cWarranty('25/25')
    .nDs('https://es-media-prod.s3.amazonaws.com/media/components/panels/spec-sheets/SEG_400w_Triple_Black.pdf')
    .s1U(295.00, 'https://cedgreentech.com/');

var PanelSil360 = new PanelPart()
    .cDesNickMakeModelMore('Sil.360', 'Silfab', 'SIL360NX', 'Mono PERC 66 Black Panel')
    .cDimPanel(/*long*/183.2, /*short*/100.0, /*height*/3.8)
    .cClamp(/*long0*/41.1, /*long1*/43.6, /*short0*/17.5, /*short1*/22.5)
    .cElecPanel(/*watts*/360, /*voc*/45.40, /*isc*/10.20)
    .cWarranty('25/30')
    .nDs('https://silfabsolar.com/wp-content/uploads/2021/09/Silfab-SIL-360-NX-20210722-Final.pdf')
    .nI('https://silfabsolar.com/wp-content/uploads/2021/11/SILFAB-MAN-SFO-15-20211027-FINAL.pdf')
    .s1U(220.00, 'https://www.platt.com/p/1895650/silfab-solar/360w-module-sil-nx-series-66-cell-black-on-black/silsil360nx');

var PanelSil490 = new PanelPart()
    .cDesNickMakeModelMore('Sil.490', 'Silfab', 'SIL490HN', 'Mono PERC 156/2 Panel')
    .cDimPanel(/*long*/226.3, /*short*/103.7, /*height*/3.5)
    .cClamp(/*long0*/51, /*long1*/61, /*short0*/20, /*short1*/30)
    .cElecPanel(/*watts*/490, /*voc*/53.96, /*isc*/11.36)
    .cWarranty('25/30')
    .nDs('https://silfabsolar.com/wp-content/uploads/2022/10/Silfab-SIL-490-HN-Data-Generic-20221017.pdf')
    .nI('https://silfabsolar.com/wp-content/uploads/2021/11/SILFAB-MAN-SSI-02-20211027.pdf')
    .s1U(369.00, 'https://www.sunhub.com/product/KDA8/silfab-490w-hn-series-mono-156-half-cell-solar-panels');

var PanelUreco400 = new PanelPart()
    .cDesNickMakeModelMore('Ureco.400', 'Ureco', 'FBM400MFG-BB', 'Panel')
    .cDimPanel(/*long*/172.3, /*short*/113.3, /*height*/3.5)
    .cClamp(/*long0*/16.1, /*long1*/36.6, /*short0*/20, /*short1*/30)
    .cElecPanel(/*watts*/400, /*voc*/37.20, /*isc*/13.68)
    .cWarranty('25/25')
    .nDs('https://www.urecorp.com/upload/product/20211207145032_module_0.pdf')
    .s1U(289.74, 'https://cedgreentech.com/');

//-----------------------------------------------------------------------------------------------------------------------
// IronRidge parts and prices
//-----------------------------------------------------------------------------------------------------------------------

var IronRidgeUfo = new Part()
    .cDesMakeModelMore('IronRidge', 'UFO-CL-01-A1', 'Universal Module Clamp Mill')
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/UFO_Family_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(3.41, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Module-Clamps/IronRidge/UFO-CL-01-A1/product.aspx?zpid=1172501')
    .s1U(4.86, 'https://www.ironridge.com/design-tools/');

var IronRidgeStopper38 = new Part()
    .cDesMakeModelMore('IronRidge', 'UFO-STP-38MM-M1', 'Stopper Sleeve 38MM Mill')
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/UFO_Family_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(0.60, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Module-Clamps/IronRidge/UFO-STP-38MM-M1/product.aspx?zpid=1172516')
    .s1U(0.80, 'https://www.ironridge.com/design-tools/');

var IronRidgeCamo = new Part()
    .cDesMakeModelMore('IronRidge', 'CAMO-01-M1', 'Hidden End Clamp')
    .nTb('https://files.ironridge.com/camo/IronRidge_CAMO_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/camo/IronRidge_CAMO_Installation_Manual.pdf')
    .s1A(6.86, 7, 'matt')
    .s1U(6.86, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Module-Clamps/IronRidge/CAMO-01-M1/product.aspx?zpid=1221813');

var IronRidgeGroundLug = new Part()
    .cDesMakeModelMore('IronRidge', 'XR-LUG-03-A1', 'Grounding Lug, Low Profile')
    .nDs('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/Flush_Mount_Data_Sheet.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1A(6.67, 1, 'matt')
    .s1U(6.67, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Grounding-Bonding-Hardware/IronRidge/XR-LUG-03-A1/product.aspx?zpid=1172499')
    .s1U(9.52, 'https://www.ironridge.com/design-tools/');

var IronRidgeFoot = new Part()
    .cDesMakeModelMore('IronRidge', 'FF2-01-M2', 'FlashFoot2 Mill')
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_FlashFoot2_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_FlashFoot2_Installation_Manual.pdf')
    .s1A(9.39, 4, 'matt')
    .s1U(9.39, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Flashings-Comp-Roof/IronRidge/FF2-01-M2/product.aspx?zpid=1796624')
    .s1U(20.68, 'https://www.ironridge.com/design-tools/');

var IronRidgeBolt = new Part()
    .cDesMakeModelMore('IronRidge', 'BHW-SQ-02-A1', 'Square-Bolt Bonding Hardware')
    .nDs('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/Flush_Mount_Data_Sheet.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1A(2.09, 1, 'matt')
    .s1U(2.09, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Hardware/IronRidge/BHW-SQ-02-A1/product.aspx?zpid=1172496')
    .s1U(2.81, 'https://www.ironridge.com/design-tools/');

var IronRidgeMlpe = new Part()
    .cDesMakeModelMore('IronRidge', 'BHW-MI-01-A1', 'Microinverter/MLPE Bonding Hardware, T-Bolt')
    .nDs('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/Flush_Mount_Data_Sheet.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1A(1.50, 1, 'matt')
    .s1U(1.50, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Hardware/IronRidge/BHW-MI-01-A1/product.aspx?zpid=1172500')
    .s1U(2.14, 'https://www.ironridge.com/design-tools/');

//-----------------------------------------------------------------------------------------------------------------------
// IronRidgeXR10 parts and prices

var IronRidgeXR10Rail132 = new RailPart()
    .cDesMakeModelMore('IronRidge', 'XR-10-132A', '11ft Mill')
    .cDimRail(/*long*/2.54*132, /*footspan*/2.54*72, /*cantilever*/2.54*24)
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_XR_Rail_Family_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(34.34, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-10-132A/product.aspx?zpid=123362');

var IronRidgeXR10Rail168 = new RailPart()
    .cDesMakeModelMore('IronRidge', 'XR-10-168A', '14ft Mill')
    .cDimRail(/*long*/2.54*168, /*footspan*/2.54*72, /*cantilever*/2.54*24)
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_XR_Rail_Family_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(43.75, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-10-168A/product.aspx?zpid=123366');

var IronRidgeXR10Rail204 = new RailPart()
    .cDesMakeModelMore('IronRidge', 'XR-10-204A', '17ft Mill')
    .cDimRail(/*long*/2.54*204, /*footspan*/2.54*72, /*cantilever*/2.54*24)
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_XR_Rail_Family_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(53.05, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-10-204A/product.aspx?zpid=123375');

var IronRidgeXR10Splice = new Part()
    .cDesMakeModelMore('IronRidge', 'XR10-BOSS-01-M1', 'Bonded Splice')
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_BOSS_Bonded_Splice_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(7.03, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rail-Splice-Kits/IronRidge/XR10-BOSS-01-M1/product.aspx?zpid=1876583')
    .s1U(9.89, 'https://www.ironridge.com/design-tools/');

//-----------------------------------------------------------------------------------------------------------------------
// IronRidgeXR100 parts and prices

var IronRidgeXR100Rail168 = new RailPart()
    .cDesMakeModelMore('IronRidge', 'XR-100-168A', '14ft Mill')
    .cDimRail(/*long*/2.54*168, /*footspan*/2.54*96, /*cantilever*/2.54*32)
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_XR_Rail_Family_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(61.86, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-100-168A/product.aspx?zpid=123382');

var IronRidgeXR100Rail204 = new RailPart()
    .cDesMakeModelMore('IronRidge', 'XR-100-204A', '17ft Mill')
    .cDimRail(/*long*/2.54*204, /*footspan*/2.54*96, /*cantilever*/2.54*32)
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_XR_Rail_Family_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(75.105, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-100-204A/product.aspx?zpid=123388');

var IronRidgeXR100Splice = new Part()
    .cDesMakeModelMore('IronRidge', 'XR100-BOSS-01-M1', 'Bonded Splice')
    .nTb('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_BOSS_Bonded_Splice_Tech_Brief.pdf')
    .nI('https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf')
    .s1U(8.385, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rail-Splice-Kits/IronRidge/XR-100-BOSS-01-M1/product.aspx?zpid=1876584')
    .s1U(9.89, 'https://www.ironridge.com/design-tools/');

//-----------------------------------------------------------------------------------------------------------------------
// Unirac parts and prices
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
// UniracSm parts and prices 

var UniracSmRail168 = new RailPart()
    .cDesMakeModelMore('Unirac', '315168M', 'SM LIGHT RAIL 168" MILL')
    .cDimRail(/*long*/2.54*168, /*footspan*/2.54*72, /*cantilever*/2.54*24) 
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(35.25, 'https://design.unirac.com/')
    .s1U(47.11, 'https://www.platt.com/p/0532097/unirac/sm-light-rail-168-mill/unr315168m');

var UniracSmRail208 = new RailPart()
    .cDesMakeModelMore('Unirac', '315208M', 'SM LIGHT RAIL 208" MILL')
    .cDimRail(/*long*/2.54*208, /*footspan*/2.54*72, /*cantilever*/2.54*24)
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(43.64, 'https://design.unirac.com/')
    .s1U(58.32, 'https://www.platt.com/p/1971393/unirac/810039363324/unr315208m');

var UniracSmRail246 = new RailPart()
    .cDesMakeModelMore('Unirac', '315246M', 'SM LIGHT RAIL 246" MILL') 
    .cDimRail(/*long*/2.54*246, /*footspan*/2.54*72, /*cantilever*/2.54*24)
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(51.61, 'https://design.unirac.com/')
    .s1U(68.97, 'https://www.platt.com/p/1843281/unirac/unr-315246m-sm-light-rail-246/810039361696/unr315246m');

var UniracSmSplice = new Part()
    .cDesMakeModelMore('Unirac', '303019M', 'BND SPLICE BAR PRO SERIES MILL')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(6.05, 'https://design.unirac.com/')
    .s1U(8.10, 'https://www.platt.com/p/1443448/unirac/unr303019m');

var UniracSmMid = new Part()
    .cDesMakeModelMore('Unirac', '302030M', 'SM PRO SERIES MID - MILL')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(2.69, 'https://design.unirac.com/')
    .s1U(3.60, 'https://www.platt.com/p/0453757/unirac/sm-midclamp-pro-mill/unr302030m');

var UniracSmEnd = new Part()
    .cDesMakeModelMore('Unirac', '302035M', 'SM PRO SERIES UNIV END - MILL')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(3.22, 'https://design.unirac.com/')
    .s1U(4.31, 'https://www.platt.com/p/0453756/unirac/sm-endclamp-pro-w-cap/unr302035m');

var UniracSmFoot = new Part()
    .cDesMakeModelMore('Unirac', '004055D', 'FLASHKIT PRO, DRK, 10PK')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(14.05, 'https://www.platt.com/p/1443390/unirac/flashkit-pro-drk-10pk/unr004055d');

var UniracSmLFoot = new Part()
    .cDesMakeModelMore('Unirac', '304001C', 'L-FOOT SERRATED W/ T-BOLT, CLR')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(3.14, 'https://design.unirac.com/')
    .s1U(4.20, 'https://www.platt.com/p/0138669/unirac/l-foot-serrated-w-t-bolt-clr/unr304001c');

var UniracSmGroundLug = new Part()
    .cDesMakeModelMore('Unirac', '008009P', 'Grounding Lug ILSCO LAY IN LUG (GBL4DBT)')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(7.54, 'https://design.unirac.com/')
    .s1U(10.08, 'https://www.platt.com/p/0126668/unirac/ilsco-lay-in-lug/unr008009p');

var UniracSmMlpe = new Part()
    .cDesMakeModelMore('Unirac', '008114M', 'MLPE MOUNT ASSY')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf')
    .s1U(2.99, 'https://www.platt.com/p/0201866/unirac/mlpe-mount/unr008114m')

//-----------------------------------------------------------------------------------------------------------------------
// UniracSfm parts and prices 

var UniracSfmTrim = new TrimPart()
    .cDesMakeModelMore('Unirac', '256072U', 'SFM TRIMRAIL 72 UNIV DRK')
    .cDimTrim(2.54*72)
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(33.25, 'https://design.unirac.com/')
    .s1U(44.43, 'https://www.platt.com/p/1971391/unirac/810039362167/unr256072u');

var UniracSfmTrimSplice = new Part()
    .cDesMakeModelMore('Unirac', '250120U', 'SFM TRIM SPLICE DRK')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(3.98, 'https://design.unirac.com/')
    .s1U(5.33, 'https://www.platt.com/p/1843277/unirac/810039361207/unr250120u');

var UniracSfmTrimFoot = new Part()
    .cDesMakeModelMore('Unirac', '004200D', 'FLASHKIT SFM TRIM COMP DARK')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(11.93, 'https://design.unirac.com/')
    .s1U(15.94, 'https://www.platt.com/p/1843250/unirac/810039360460/unr004200d');

var UniracSfmTrimClip = new Part()
    .cDesMakeModelMore('Unirac', '250110U', 'SFM TRIMRAIL UNIV CLIP W/HDW')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(2.69, 'https://design.unirac.com/')
    .s1U(3.45, 'https://www.solarflexion.com/product-p/250110U.htm')
    //.s1U(0.00, 'https://www.platt.com/p/1843276/unirac/unr-250110u-sfm-trimrail-univ/unr250110u')

var UniracSfmTrimCap = new Part()
    .cDesMakeModelMore('Unirac', '250130U', 'SFM TRIM END CAPS')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(1.13, 'https://design.unirac.com/')
    .s1U(1.51, 'https://www.platt.com/p/1843278/unirac/810039361214/unr250130u');

var UniracSfmTrimBond = new Part()
    .cDesMakeModelMore('Unirac', '008100U', 'SFM TRIM BONDING CLAMP')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(3.92, 'https://design.unirac.com/')
    .s1U(5.24, 'https://www.platt.com/p/1843270/unirac/810039361047/unr008100u');

var UniracSfmMicrorail = new Part()
    .cDesMakeModelMore('Unirac', '250020U', 'SFM MICRORAIL 2"')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(8.27, 'https://design.unirac.com/')
    .s1U(11.05, 'https://www.platt.com/p/1843273/unirac/810039361177/unr250020u');

var UniracSfmAttSplice = new Part()
    .cDesMakeModelMore('Unirac', '250030U', 'SFM ATT SPLICE 8"')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(13.68, 'https://design.unirac.com/')
    .s1U(18.28, 'https://www.platt.com/p/1843275/unirac/810039361184/unr250030u');

var UniracSfmSplice = new Part()
    .cDesMakeModelMore('Unirac', '250010U', 'SFM SPLICE 6.5"')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(9.58, 'https://design.unirac.com/')
    .s1U(12.81, 'https://www.platt.com/p/1843272/unirac/810039361160/unr250010u');

var UniracSfmFoot = new Part()
    .cDesMakeModelMore('Unirac', '004270D', 'FLASHKIT SFM SLIDER COMP DARK')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(9.44, 'https://design.unirac.com/')
    .s1U(12.63, 'https://www.platt.com/p/1843251/unirac/810039360484/unr004270d');

var UniracSfmNsbond = new Part()
    .cDesMakeModelMore('Unirac', '008000U', 'SFM N/S BONDING CLAMP')
    .nI('https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf')
    .nCat('https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf')
    .s1U(2.26, 'https://design.unirac.com/')
    .s1U(3.03, 'https://www.platt.com/p/1843269/unirac/810039360897/unr008000u');

//-----------------------------------------------------------------------------------------------------------------------
// SnapnrackRlu (SnapNRack RL-U)
//-----------------------------------------------------------------------------------------------------------------------

var SnapnrackRluCompFlash = new Part()
    .cDesMakeModelMore('SnapNrack', '232-01375', 'COMP FLASHING, 9IN X 12IN, BLACK ALUM')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(5.51, 'https://snapnrack.com/configurator/')
    .s1U(4.67, 'https://www.platt.com/p/1305653/snapnrack/comp-flashing/srk23201375');

var SnapnrackRluCompTrack = new Part()
    .cDesMakeModelMore('SnapNrack', '232-01371', 'FLASH TRACK PRC, CONE HOLE, PLAIN ENDS, 7-1/2IN, MILL')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(5.00, 'https://snapnrack.com/configurator/');

var SnapnrackRluUmbrellaLag = new Part()
    .cDesMakeModelMore('SnapNrack', '242-92266', 'UMBRELLA LAG, TYPE 3, 4IN, SS')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(1.55, 'https://snapnrack.com/configurator/')
    .s1U(1.20, 'https://www.platt.com/p/1305652/snapnrack/4-umbrella-lag-mount-waterproof-stainless-steel/srk24292266');

var SnapnrackRluSpeedsealTrack = new Part()
    .cDesMakeModelMore('SnapNrack', '232-01464', 'RL UNIVERSAL SPEEDSEAL TRACK')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(8.75, 'https://snapnrack.com/configurator/');

var SnapnrackRluSpeedsealLag = new Part()
    .cDesMakeModelMore('SnapNrack', '242-02168', 'SEALING WASHER LAG, 4-1/2IN, SS')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(1.25, 'https://snapnrack.com/configurator/')
    .s1U(0.97, 'https://www.platt.com/p/1853504/snapnrack/srk24202168');

var SnapnrackRluMount = new Part()
    .cDesMakeModelMore('SnapNrack', '242-02155', 'RL UNIVERSAL, MOUNT')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(11.75, 'https://snapnrack.com/configurator/');

var SnapnrackRluLink = new Part()
    .cDesMakeModelMore('SnapNrack', '242-02156', 'RL UNIVERSAL, LINK')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(11.69, 'https://snapnrack.com/configurator/')
    .s1U(9.91, 'https://www.platt.com/p/1790279/snapnrack/srk24202156');

var SnapnrackRluSkirt = new TrimPart()
    .cDesMakeModelMore('SnapNrack', '232-02493', 'RL UNIVERSAL, LANDSCAPE SKIRT, 83IN, BLACK')
.cDimTrim(2.54*83)
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(47.88, 'https://snapnrack.com/configurator/')
    .s1U(40.56, 'https://www.platt.com/p/1790273/snapnrack/srk23202493');

var SnapnrackRluSkirtSpacer40 = new Part()
    .cDesMakeModelMore('SnapNrack', '232-02497', 'RL UNIVERSAL, SKIRT SPACER, 40MM')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(0.68, 'https://snapnrack.com/configurator/')
    .s1U(0.58, 'https://www.platt.com/p/1790277/snapnrack/srk23202497');

var SnapnrackRluGroundLug = new Part()
    .cDesMakeModelMore('SnapNrack', '242-02101', 'GROUND LUG R, 6-12 AWG')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(5.46, 'https://snapnrack.com/configurator/')
    .s1U(4.63, 'https://www.platt.com/p/0107174/snapnrack/100-ul-series-grounding-lug-assembly/srk24202101');

var SnapnrackRluMlpe = new Part()
    .cDesMakeModelMore('SnapNrack', '242-02151', 'MLPE FRAME ATTACHMENT KIT')
    .nCat('https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf')
    .nI('https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf')
    .s1U(4.68, 'https://snapnrack.com/configurator/')
    .s1U(4.63, 'https://www.platt.com/p/0107174/snapnrack/100-ul-series-grounding-lug-assembly/srk24202101');

//-----------------------------------------------------------------------------------------------------------------------
// Inverter SolarEdge
//-----------------------------------------------------------------------------------------------------------------------

var SolarEdgeSe11400h_us000bni4 = new SolarEdgeInvPart()
    .cDesNickMakeModelMore('SE.11400H-US', 'SolarEdge', 'SE11400H-US000BNI4', 'RGM+Export/Import')
    .cElecInvSe(/*acW*/11400, /*acV*/240, /*acImax*/47.5, /*dcW*/17650, /*dcVmax*/480, /*dcVNom*/400, /*dcImax*/30.5)
    .nI('https://knowledge-center.solaredge.com/sites/kc/files/se_hd_wave_inverter_with_SetApp_installation_guide_na.pdf')
    .s1U(2316.00, 'https://www.platt.com/p/1821855/solaredge/sed-se11400h-us000bni4/sedse11400hus000bi');

var SolarEdgeSe11400h_ussnbbl14 = new SolarEdgeInvPart()
    .cDesMakeModelMore('SolarEdge', 'SE11400H-USSNBBL14', 'Battery+EV+RGM+Export/Import')
    .cElecInvSe(/*acW*/11400, /*acV*/240, /*acImax*/47.5, /*dcW*/22800, /*dcVmax*/480, /*dcVNom*/380, /*dcImax*/31)
    .nI('https://knowledge-center.solaredge.com/sites/kc/files/se-single-phase-energy-hub-high-power-installation-guide-na.pdf')
    .nUrl('Battery compatibility', 'https://knowledge-center.solaredge.com/sites/kc/files/se-battery-compatibility-with-energy-hub-guide-nam.pdf')
    .s1U(3589.1900, 'https://www.platt.com/p/1973303/solaredge/11400w-single-hd-wave-phase-inverter/sedse11400hussnbbl');

var SolarEdgeP400 = new OptimizerPart()
    .cDesMakeModelMore('SolarEdge', 'P400', 'Optimizer')
    .cElecOptSe(/*inoutW*/400, /*inVmax*/80, /*inImax*/10.1, /*outVmax*/60, /*outImax*/15)
    .nDs('https://knowledge-center.solaredge.com/sites/kc/files/se-P5-series-add-on-power-optimizer-datasheet-na.pdf')
    .nUrl('Intercompatibility', 'https://knowledge-center.solaredge.com/sites/kc/files/application_note_intercompatibility_se_power_optimizers.pdf')
    .s1A(42.00, 21, 'matt');

var SolarEdgeS500 = new OptimizerPart()
    .cDesMakeModelMore('SolarEdge', 'S500', 'Optimizer')
    .cElecOptSe(/*inoutW*/400, /*inVmax*/60, /*inImax*/14.5, /*outVmax*/60, /*outImax*/15)
    .nDs('https://knowledge-center.solaredge.com/sites/kc/files/se-power-optimizer-s-series-datasheet.pdf')
    .nUrl('Intercompatibility', 'https://knowledge-center.solaredge.com/sites/kc/files/application_note_intercompatibility_se_power_optimizers.pdf')
    .s1U(84.99, 'https://www.platt.com/p/2011140/solaredge/dc-power-optimizer-500w-60vdc/seds500');

var SolarEdgeCt225 = new CtPart()
    .cDesMakeModelMore('SolarEdge', 'SECT-SPL-225A-T-20', '17ft, 18-20 AWG TP, CT')
    .cCt(225, 'Split core, Clamp')
    .nDs('https://knowledge-center.solaredge.com/sites/kc/files/se-slim-current-transformer-datasheet-na.pdf')
    .s1U(41.62, 'https://www.platt.com/p/1950422/solaredge/slim-current-transformer-split-core/sedsectspl225at20');

//-----------------------------------------------------------------------------------------------------------------------
// Inverter Enphase (todo)
//-----------------------------------------------------------------------------------------------------------------------

// Enphase IQ8PLUS-72-M-US  290W $189.00 1.39 11.205
// Enphase IQ8M-72-M-US     325W $209.50 1.24 11.189
// Enphase IQ8A-72-M-US     349W $223.00 1.16 11.177
// Enphase IQ8H-240-72-M-US 380W $242.00

//-----------------------------------------------------------------------------------------------------------------------
// Electrical other
//-----------------------------------------------------------------------------------------------------------------------

var Breaker_HOM260CP = new BreakerPart()
    .cDesMakeModelMore('Square D', 'HOM260CP', 'HOM 2x60 Breaker')
    .cBreaker(/*typ*/'HOM', /*pole*/2, /*itrip*/60)
    .s1U(17.83, 'https://www.homedepot.com/p/Square-D-Homeline-60-Amp-2-Pole-Circuit-Breaker-HOM260CP-HOM260CP/202353322');

var Breaker_Q22020CTU = new BreakerPlexPart()
    .cDesMakeModelMore('Siemens', 'Q22020CTU', 'QT 1x20,2x20,1x20 Breaker')
    .cBreakerPlex(/*typ*/'QT', /*...poleItripV*/[1,20], [2,20], [1,20])
    .s1U(29.85, 'https://www.homedepot.com/p/Siemens-Triplex-Two-Outer-20-Amp-Single-Pole-and-One-Inner-20-Amp-Double-Pole-Circuit-Breaker-Q22020CTU/202276298');

var Breaker_Q260 = new BreakerPart()
    .cDesMakeModelMore('Siemens', 'Q260', 'QP 2x60 Breaker')
    .cBreaker(/*typ*/'QP', /*pole*/2, /*itrip*/60)
    .s1U(15.52, 'https://www.amazon.com/Q260-60-Amp-Double-Circuit-Breaker/dp/B00002N7KY/');

var Breaker_QO260CP = new BreakerPart()
    .cDesMakeModelMore('Square D', 'QO260CP', 'QO 2x60 Breaker')
    .cBreaker(/*typ*/'QO', /*pole*/2, /*itrip*/60)
    .s1U(41.70, 'https://www.homedepot.com/p/Square-D-QO-60-Amp-2-Pole-Circuit-Breaker-QO260CP-QO260CP/100065234');

var Breaker_QOM2175VH = new BreakerPart()
    .cDesMakeModelMore('Square D', 'QOM2175VH', 'QOM 2x175 Main Breaker')
    .cBreaker(/*typ*/'QOM', /*pole*/2, /*itrip*/175)
    .s1U(219.77, 'https://www.ebay.com/itm/304861992085')
    .s1U(299.00, 'https://www.amazon.com/Square-Schneider-Electric-QOM2175VH-Homeline/dp/B00CONRDI8');

var Breaker_QOM2200VH = new BreakerPart()
    .cDesMakeModelMore('Square D', 'QOM2200VH', '2x200 Main Breaker')
    .cBreaker(/*typ*/'QOM', /*pole*/2, /*itrip*/200)
    .s1U(99.95, 'https://www.ebay.com/itm/155526280540');

var ConduitBody_34_C = new Part()
    .cDesGeneric('Conduit Body C 3/4"')
    .s1U(6.88, 'https://www.homedepot.com/p/3-4-in-Rigid-Threaded-Aluminum-Conduit-Body-58407/100119285');

var ConduitBody_34_LB = new Part()
    .cDesGeneric('Conduit Body LB 3/4"')
    .s1U(7.21, 'https://www.homedepot.com/p/Halex-3-4-in-Rigid-Type-LB-Threaded-Aluminum-Conduit-Body-Standard-Fitting-58607/100146504');

var ConduitBody_34_LL = new Part()
    .cDesGeneric('Conduit Body LL 3/4"')
    .s1U(7.20, 'https://www.homedepot.com/p/Halex-3-4-in-Rigid-Threaded-Conduit-Body-58307/100132328');

var ConduitBody_34_LR = new Part()
    .cDesGeneric('Conduit Body LR 3/4"')
    .s1U(6.88, 'https://www.homedepot.com/p/Halex-3-4-in-Rigid-Type-LR-Threaded-Conduit-Body-58907/100127631');

var ConduitBody_34_T = new Part()
    .cDesGeneric('Conduit Body Tee 3/4"')
    .s1U(8.20, 'https://www.homedepot.com/p/Halex-3-4-in-Rigid-Type-T-Threaded-Conduit-Body-58807/100128391')

var ConduitBody_1_C = new Part()
    .cDesGeneric('Conduit Body C 1"')
    .s1U(9.20, 'https://www.homedepot.com/p/Halex-1-in-Rigid-Threaded-Conduit-Body-58410/100163620');

var ConduitBody_1_LB = new Part()
    .cDesGeneric('Conduit Body LB 1"')
    .s1U(10.38, 'https://www.homedepot.com/p/Halex-1-in-Rigid-Threaded-Aluminum-Conduit-Body-58610/100116891');

var ConduitBody_1_LL = new Part()
    .cDesGeneric('Conduit Body LL 1"')
    .s1A(9.40, 1, 'matt')
    .s1U(9.40, 'https://www.homedepot.com/p/1-in-Rigid-Type-LL-Threaded-Conduit-Body-with-Cover-and-Gasket-58310/100207167');

var ConduitBody_1_LR = new Part()
    .cDesGeneric('Conduit Body LR 1"')
    .s1A(9.40, 1, 'matt')
    .s1U(6.48, 'https://www.homedepot.com/p/Halex-1-in-Rigid-Type-LR-Threaded-Rigid-Conduit-Body-58910/100143907');

var ConduitBody_1_T = new Part()
    .cDesGeneric('Conduit Body Tee 1"')
    .s1A(12.20, 1, 'matt')
    .s1U(12.20, 'https://www.homedepot.com/p/Halex-1-in-Rigid-Type-T-Threaded-Conduit-Body-58810/100125899');

var ConduitCouplingRigid_34 = new Part()
    .cDesGeneric('Conduit Coupling Rigid 3/4"')
    .s1U(2.42, 'https://www.homedepot.com/p/Halex-3-4-in-Rigid-Conduit-Coupling-64007/100164200');

var ConduitCouplingRigid_1 = new Part()
    .cDesGeneric('Conduit Coupling Rigid 1"')
    .s1U(3.63, 'https://www.homedepot.com/p/Halex-1-in-Rigid-Conduit-Coupling-64010/100170091');

var ConduitElbow_1_90 = new Part()
    .cDesGeneric('Conduit Elbow Threaded, 1" x 90deg')
    .s1U(16.41, 'https://www.ebay.com/itm/295684243935');

var ConduitFoot_IronRidge = new Part()
    .cDesMakeModelMore('IronRidge', 'FM-CM-001-B', 'Conduit Flashing 4-pack')
    .s1A(18.45, 3, 'matt')
    .sNU(73.78, 4, 'https://www.platt.com/p/0557412/ironridge/conduit-flashing-4-pack/irnfmcm001b');

var ConduitPenetration_IronRidge = new Part()
    .cDesMakeModelMore('IronRidge', 'QMCPC-A-12', 'Conduit Penetration Flashing 1/2" - 1"')
    .s1U(15.33, 'https://www.platt.com/p/0102980/ironridge/conduit-penetration-flashing/qmpqmcpca12');

var ConduitPenetration_Nichols = new Part()
    .cDesMakeModelMore('Nichols', 'F121', 'Conduit Penetration Flashing 9" x 12", A 26 Gauge Galvanized')
    .s1U(12.85, 'https://www.platt.com/p/0093946/nichols/roof-flashing-featuring-a-26-gauge-galvanized-bass-size-9x12/78632326972%20/nicf121');

var ConduitNipple_34_2 = new Part()
    .cDesGeneric('Conduit Nipple Threaded, 3/4" x 2", Steel')
    .s1U(2.42, 'https://www.homedepot.com/p/Halex-3-4-in-x-2-in-Rigid-Conduit-Nipple-64327/100174792');

var ConduitNipple_34_6 = new Part()
    .cDesGeneric('Conduit Nipple Threaded, 3/4" x 6"')
    .s1U(2.97, 'https://www.homedepot.com/p/Halex-3-4-in-x-6-in-Rigid-Conduit-Nipple-64362/100149814');

var ConduitNipple_1_2p5 = new Part()
    .cDesGeneric('Conduit Nipple Threaded, 1" x 2-1/2", Steel')
    .s1U(2.49+3.95, 'https://www.ebay.com/itm/262491593877');

var ConduitNipple_1_6 = new Part()
    .cDesGeneric('Conduit Nipple Threaded, 1" x 6"')
    .s1U(4.15, 'https://www.homedepot.com/p/1-in-Rigid-Conduit-Nipple-64363/100194604');

var ConduitStrap_34 = new Part()
    .cDesGeneric('Conduit Strap, EMT, 1-Hole, 3/4"')
    .s1A(0.46, 12, 'matt')
    .s1U(0.46, 'https://www.platt.com/p/0066488/1-hole-emt-strap-3-4/050169020838/34es1h');

var ConduitStrap_1 = new Part()
    .cDesGeneric('Conduit Strap, EMT, 1-Hole, 1"')
    .s1A(0.24, 4, 'matt')
    .sNU(11.94, 50, 'https://www.homedepot.com/p/1-in-Electrical-Metallic-Tube-EMT-1-Hole-Straps-50-Pack-61510B/100202651')
    .s1U(0.61, 'https://www.platt.com/p/0066356/1-hole-emt-strap-1/050169020845/1es1h');

var Ctap_Blue = new Part()
    .cDesGeneric('C-Tap Crimp Blue <b>[APPROXIMATE]</b>')
    .s1A(1.50, 3, 'matt');

var Ctap_Gray = new Part()
    .cDesGeneric('C-Tap Crimp Gray <b>[APPROXIMATE]</b>')
    .s1A(4.00, 1, 'matt');

var DiscoGnf222ra = new DiscoPart()
    .cDesMakeModelMore('Siemens', 'GNF222RA', 'Disconnect w/ hub provision')
    .cDisco(/*phase*/'240V', /*pole*/2, /*imax*/60, /*enclosure*/'Type 3R, Non-fusible')
    .nDs('https://assets.new.siemens.com/siemens/assets/api/uuid:5c71c5ec-7826-4b33-bad2-c861d7d9534e/sie-ss-switch-60a-240a-nf3r.pdf')
    .s1U(88.31, 'https://www.amazon.com/SIEMENS-General-Safety-Outdoor-Non-Fusible/dp/B07PS6BXLR/');

var DiscoLnf222ra = new DiscoPart()
    .cDesMakeModelMore('Siemens', 'LNF222RA', 'Disconnect w/o hub provision')
    .cDisco(/*phase*/'240V', /*pole*/2, /*imax*/60, /*enclosure*/'Type 3R, Non-fusible')
    .nDs('https://assets.new.siemens.com/siemens/assets/api/uuid:7adb416d-e4f1-4e6c-9f9f-32d104e32e6b/sie-ss-switch-60a-240a-nf3r-ln.pdf')
    .s1U(67.49, 'https://www.amazon.com/SIEMENS-General-Safety-Outdoor-Non-Fusible/dp/B07PS6F5PV/');

var Emt_34 = new ConduitPart()
    .cDesGeneric('EMT Conduit, 3/4", Steel, 1ft')
    .cConduit('EMT', '3/4"', 23.4, 20.9)
    .s1A(1.17, 50, 'matt')
    .sNU(1.17*10, 10, 'https://www.platt.com/p/0065970/emt-conduit-3-4-steel-10/091111020025/34e');

var Emt_1 = new ConduitPart()
    .cDesGeneric('EMT Conduit, 1", Steel, 1ft')
    .cConduit('EMT', '1"', 29.5, 26.6)
    .sNU(18.56, 10, 'https://www.homedepot.com/p/1-in-x-10-ft-Electric-Metallic-Tube-EMT-Conduit-101568/100400409')
    .sNU(2.22*10, 10, 'https://www.platt.com/p/0065797/emt-conduit-1-steel-10/091111020032/1e');

var EmtConnector_34 = new Part()
    .cDesGeneric('EMT Compression Connector, 3/4 inch, Insulated, Raintight, Steel')
    .s1A(2.55, 15, 'matt')
    .s1U(2.55, 'https://www.platt.com/p/0641064/arlington/emt-compression-connector-3-4-insulated-raintight-steel/018997820464/arl821art');

var EmtConnector_1 = new Part()
    .cDesGeneric('EMT Compression Connector, 1 inch, Insulated, Raintight, Steel')
    .sNU(27.40, 15, 'https://www.amazon.com/Hubbell-Raco-2914RT-Compression-Connector-Insulated/dp/B018S4N6KA')
    .s1U(4.77, 'https://www.platt.com/p/0641063/arlington/emt-compression-connector-1-inch-insulated-raintight-steel/018997820471/arl822art');

var EmtCoupling_34 = new Part()
    .cDesGeneric('EMT Compression Coupling, 3/4 inch, Raintight, Steel')
    .s1A(2.55, 10, 'matt')
    .s1U(2.55, 'https://www.platt.com/p/0641068/arlington/emt-compression-coupling-3-4-inch-raintight-concrete-tight-steel/018997820310/arl831rt');

var EmtCoupling_1 = new Part()
    .cDesGeneric('EMT Compression Coupling, 1 inch, Raintight, Steel')
    .s1A(4.67, 10, 'matt')
    .s1U(4.67, 'https://www.platt.com/p/0641070/arlington/emt-compression-coupling-1-inch-raintight-concrete-tight-steel/018997820327/arl832rt');

var GroundBushing_34 = new Part()
    .cDesGeneric('Grounding Bushing, 3/4", Threaded, Insulated, Malleable Iron')
    .s1A(13.14, 4, 'matt')
    .s1U(13.14, 'https://www.platt.com/p/0078681/appleton/grounding-bushing-3-4-threaded-insulated-malleable-iron/781381091084/appgib75l4ac');

var GroundBushing_1 = new Part()
    .cDesGeneric('Grounding Bushing, 1", Threaded, Insulated, Malleable Iron')
    .s1A(9.39, 1, 'matt')
    .s1U(4.90 + 4.49, 'https://www.amazon.com/Ground-Bushing-Threaded-malleable-Insulated/dp/B08V99LF5J/')
    .s1U(13.14, 'https://www.platt.com/p/0002870/appleton/grounding-bushing-1-threaded-insulated-malleable-iron/781381091107/appgib100l4ac');

var GroundClamp = new Part()
    .cDesGeneric('Ground Clamp, 1/2" - 1", Bronze, Direct Burial')
    .s1U(8.10, 'https://www.platt.com/p/0267477/dottie/1-2-1-ground-clamp/781002675006/121directburial')

var GroundLug_Al = new Part()
    .cDesGeneric('Ground Lug Lay-In Al 14-1/0 AWG (interior)')
    .s1A(3.00, 100, 'matt')
    .s1U(5.00, 'https://www.platt.com/p/0708312/ilsco/14-1-0-awg-aluminum-lay-in-lug/783669960105/ilsgbl10');

var GroundLug_CuSn = new Part()
    .cDesGeneric('Ground Lug Lay-In Cu 14 -4 AWG (exterior)')
    .s1U(3.45 + 5.60, 'https://www.amazon.com/Burndy-CL501TNBULK-Electro-Plated-Copper/dp/B06XDJJY5S/')
    .s1U(12.16, 'https://www.platt.com/p/0606231/ilsco/lay-in-lug-copper-14-4-awg/783669960181/ilsgbl4dbt');

var GroundRod = new Part()
    .cDesGeneric('Ground Rod, Copper, 5/8" x 8ft')
    .s1U(35.59, 'https://www.platt.com/p/0050562/5-8-copper-ground-rod/782856306092/588cgr');

var Jbox_IronRidge = new Part()
    .cDesMakeModelMore('IronRidge', 'QM-JBX-RL02-B1', 'JayBox, QuickMount, Rail-Mounted, Black')
    .sNU(47.21, 1, 'https://www.platt.com/p/2072545/ironridge/quickmount-jaybox-rail-mounted-black/qmpqmjbxrl02b1');

var JboxDinRail = new Part()
    .cDesGeneric('Jbox DIN Rail, Slotted, Zinc Plated Steel, 35mm x 7.5mm x 2m')
    .s1U(10.92, 'https://www.platt.com/p/0020224/entrelec/din-rail-slotted-zinc-plated-steel-35mm-x-75mm-x-2m/662019961903/ent1sna173220r0500');

var JboxMasthead = new Part()
    .cDesGeneric('Jbox Masthead for junction box, 1" 9-hole')
    .s1U(10.00, 'https://www.ebay.com/itm/134167843292');

var JboxTerminal_10_feed = new Part()
    .cDesMakeModelMore('Entrelec', '0115 116.07', 'Jbox Terminal Block, Feed Through, M 4/6, Gray, Screw')
    .s1U(1.46, 'https://www.platt.com/p/0020066/entrelec/terminal-block-feed-through-m-4-6-6mm-gray-screw-clamp/662019955872/ent1sna115116r0700');

var JboxTerminal_10_gnd = new Part()
    .cDesMakeModelMore('Entrelec', '0165 113.16', 'Jbox Terminal Block, Ground, M4/6.P, Green/Yellow, Screw')
    .s1U(7.05, 'https://www.platt.com/p/0020175/entrelec/terminal-block-ground-6mm-type-4-6p-green-yellow/662019960203/ent1sna165113r1600');

var JboxTerminal_8_gnd = new Part()
    .cDesMakeModelMore('Entrelec', '0165 114.17', 'Jbox Terminal Block, Ground, M6/8.P, Green/Yellow, Screw')
    .s1U(6.67, 'https://www.platt.com/p/0020176/entrelec/terminal-block-ground-8mm-type-6-8p-green-yellow/662019960210/ent1sna165114r1700');
				     
var JboxTerminalEnd = new Part()
    .cDesMakeModelMore('Entrelec', 'FEM6', 'Jbox Terminal End Section, Snap-On')
    .s1U(0.50, 'https://www.platt.com/p/0020112/entrelec/snap-on-end-section-type-fem6/804325507974/ent1sna118368r1600');

var Locknut_34 = new Part()
    .cDesGeneric('Locknut 3/4"')
    .s1A(0.10, 30, 'matt');

var Locknut_1 = new Part()
    .cDesGeneric('Locknut 1"')
    .s1A(0.10, 30, 'matt');

// todo non-generic
var Mc4_M = new Part()
    .cDesGeneric('MC-4 Connector Male')
    .s1A(1.82, 50, 'matt')
    .s1U(1.82, 'https://www.platt.com/p/0798739/stubli-electrical-connectors/cable-connector-mc-type-4-male/muc320015p0001ur');

// todo non-generic
var Mc4_F = new Part()
    .cDesGeneric('MC-4 Connector Female')
    .s1A(2.08, 50, 'matt')
    .s1U(2.08, 'https://www.platt.com/p/0798740/stubli-electrical-connectors/cable-connector-mc-type-4-female/muc320014p0001ur');

var LoadcenterSquaredQO130M200 = new LoadcenterPart()
    .cDesMakeModelMore('Square D', 'QO130M200', 'Load center')
    .cElecLoadcenter(/*phase*/'120/240V', /*ibus*/200, /*spaceN*/30, /*enclosure*/'NEMA1',
	/*typV*/['QO'], /*mainTypV*/['QOM'])
    .nDs('https://www.se.com/us/en/product/download-pdf/QO130M200');

var PaintSprayMatteBlack = new Part()
    .cDesGeneric('Paint, Spray, Matte Black')
    .s1A(3.00, 1, 'matt')
    .s1U(8.48, 'https://www.lowes.com');

var PaintSprayGalvanizing = new Part()
    .cDesGeneric('Paint, Spray, Galvanizing')
    .s1A(3.00, 1, 'matt')
    .s1U(10.50, 'https://www.beaumonthardware.com/');

var ReducingBushing_1_34 = new Part()
    .cDesGeneric('Reducing Bushing, 1" x 3/4"')
    .s1U(1.67, 'https://www.homedepot.com/p/Halex-1-in-x-3-4-in-Rigid-Reducing-Bushing-91332/100186383');

var ReducingWasher_1_34 = new Part()
    .cDesGeneric('Reducing Washer, 1" x 3/4", Steel')
    .s1A(0.34, 10, 'matt')
    .s1U(0.34, 'https://www.platt.com/p/0676009/dottie/reducing-washer-1-x-3-4-steel/781002301097/dotrw32');

var Wire_bare_6 = new WirePart()
    .cDesGeneric('Wire, Bare, 6 AWG, Solid, 1ft')
    .cWire(/*awg*/6, /*typ*/'solid', /*color*/'bare')
    .s1A(0.65, 290, 'matt')
    .sNU(199.00, 315, 'https://www.ebay.com/');

var Wire_pv_10 = new WirePart()
    .cDesGeneric('Wire, PV, 10 AWG, Black, 1ft')
    .cWire(/*awg*/10, /*typ*/'PV', /*color*/'black')
    .s1A(0.51, 180, 'matt')
    .sNU(255.00, 500, 'https://www.platt.com/p/0043334/10-awg-1000v-solar-pv-wire-500-black/10pv1000vblax500');

var Wire_tffn_18_blk = new WirePart()
    .cDesGeneric('Wire, TFFN, 18 AWG, Black')
    .cWire(/*awg*/18, /*typ*/'TFFN', /*color*/'black');

var Wire_tffn_18_wht = new WirePart()
    .cDesGeneric('Wire, TFFN, 18 AWG, White')
    .cWire(/*awg*/18, /*typ*/'TFFN', /*color*/'white');

var Wire_thhn_6_blk = new WirePart()
    .cDesGeneric('Wire, THHN/THWN-2, 6 AWG, Black, 1ft')
    .cWire(/*awg*/6, /*typ*/'THWN-2', /*color*/'black')
    .s1U(1.58, 'https://www.homedepot.com/p/Southwire-By-the-Foot-6-Black-Stranded-CU-SIMpull-THHN-Wire-20493399/204632784');

var Wire_thhn_6_grn = new WirePart()
    .cDesGeneric('Wire, THHN/THWN-2, 6 AWG, Green, 1ft')
    .cWire(/*awg*/6, /*typ*/'THWN-2', /*color*/'green')
    .s1A(0.87, 500, 'matt')
    .sNU(0.87*500, 500, 'https://www.platt.com/p/0062733/6-awg-thhn-thwn-2-stranded-copper-green-500/048243231928/6thhncstrgrex500');

var Wire_thhn_6_red = new WirePart()
    .cDesGeneric('Wire THHN/THWN-2, 6 AWG, Red, 1ft')
    .cWire(/*awg*/6, /*typ*/'THWN-2', /*color*/'red')
    .s1U(1.58, 'https://www.homedepot.com/p/Southwire-By-the-Foot-6-Red-Stranded-CU-SIMpull-THHN-Wire-20495899/204632880');

var Wire_thhn_6_wht = new WirePart()
    .cDesGeneric('Wire THHN/THWN-2, 6 AWG, White, 1ft')
    .cWire(/*awg*/6, /*typ*/'THWN-2', /*color*/'white')
    .s1U(1.58, 'https://www.homedepot.com/p/Southwire-By-the-Foot-6-White-Stranded-CU-SIMpull-THHN-Wire-20494199/204632877');

var Wire_thhn_8_grn = new WirePart()
    .cDesGeneric('Wire, THHN/THWN-2, 8 AWG, Green, 1ft')
    .cWire(/*awg*/8, /*typ*/'THWN-2', /*color*/'green')
    .s1U(0.97, 'https://www.homedepot.com/p/Southwire-By-the-Foot-8-Green-Stranded-CU-SIMpull-THHN-Wire-20492599/204632885')
    .sNU(0.54, 1, 'https://www.platt.com/p/0099636/8-awg-thhn-thwn-2-stranded-copper-green-2500/048243231423/8thhncstrgrex2500');

var Wire_thhn_8_wht = new WirePart()
    .cDesGeneric('Wire, THHN/THWN-2, 8 AWG, White, 1ft')
    .cWire(/*awg*/8, /*typ*/'THWN-2', /*color*/'white')
    .s1U(0.97, 'https://www.homedepot.com/p/Southwire-By-the-Foot-8-White-Stranded-CU-SIMpull-THHN-Wire-20489199/204632884');


var Wire_thhn_10_blk = new WirePart()
    .cDesGeneric('Wire, THHN/THWN-2, 10 AWG, Black, 1ft')
    .cWire(/*awg*/10, /*typ*/'THWN-2', /*color*/'black')
    .s1A(0.32, 50, 'matt')
    .sNU(0.32*500, 500, 'https://www.platt.com/p/0062557/10-awg-thhn-thwn-2-stranded-copper-black-500/048243230006/10thhncstrblax500');

var Wire_thhn_10_grn = new WirePart()
    .cDesGeneric('Wire, THHN/THWN-2, 10 AWG, Green, 1ft')
    .cWire(/*awg*/10, /*typ*/'THWN-2', /*color*/'green')
    .s1A(0.32, 438, 'matt')
    .sNU(0.32*500, 500, 'https://www.platt.com/p/0062575/10-awg-thhn-thwn-stranded-copper-green-500/048243230402/10thhncstrgrex500');

var Wire_thhn_10_red = new WirePart()
    .cDesGeneric('Wire, THHN/THWN-2, 10 AWG, Red, 1ft')
    .cWire(/*awg*/10, /*typ*/'THWN-2', /*color*/'red')
    .sNU(0.32*500, 500, 'https://www.platt.com/p/0062593/10-awg-thhn-thwn-2-stranded-copper-red-500/048243230204/10thhncstrredx500');

var Wire_thhn_10_wht = new WirePart()
    .cDesGeneric('Wire, THHN/THWN-2, 10 AWG, Wht, 1ft')
    .cWire(/*awg*/10, /*typ*/'THWN-2', /*color*/'white')
    .sNU(0.32*500, 500, 'https://www.platt.com/p/0062598/10-awg-thhn-thwn-2-stranded-copper-white-500/048243230105/10thhncstrwhix500');

var WireClip = new Part()
    .cDesGeneric('Wire Clip, Heyco S6405 SunRunner Stainless Steel')
    .sNU(25.98, 100, 'https://www.amazon.com/Heyco-S6405-SunRunner-Stainless-Package/dp/B00HK2990I/');

//-----------------------------------------------------------------------------------------------------------------------
// Other
//-----------------------------------------------------------------------------------------------------------------------

var Geocel2300 = new Part()
    .cDesGeneric('Geocel 2300 Construction Tripolymer Sealant')
    .s1U(8.00, 'https://www.abcsupply.com/locations/location/?id=074');

var ScrewSs = new Part()
    .cDesGeneric('Screw SS <b>[SIZE UNDETERMINED]</b>')
    .s1(1.00, 'matt');

var WasherSs = new Part()
    .cDesGeneric('Washer SS <b>[SIZE UNDETERMINED]</b>')
    .s1(0.50, 'matt');

var TbdMlpePart = new Part()
    .cDesGeneric('[TBD] MLPE attachment')
    .s1(3.00, 'tbd');
