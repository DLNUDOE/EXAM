#!/bin/bash
echo"                                      G.:                                       
                                     ,:..i                                      
                                    ,.,:ttW                                     
                                   f::.#KW#E                                    
                            ,t,iffGi.:EE;DGj                                    
                         DD::ti,,:i.:.L;:KLf                                    
                        GDK:;::,,:::.i#::t#                                     
                       DGE::::::,,::j:L#KW.                                     
                      DDE#:::,:::::;::it#              L,:,.                    
                     DDDE#: L#::,.,:.ittEDKE LW.KGDEKW::.;tt                    
                     DEE#:.#,.:::i,.,itiDDDDDDDDDEGGED#.iK                      
                    ;DKEG:.Ej:::::#LittKDDDDDDDEGEDEEE#DG                       
                    fDE#f:,::,::::E.DtjKDGDDDEEEEEDK#f                          
                    ,DE#::::::::: jftjKEEEEK###,                                
                    GDEW::::::::::Lit##j.                                       
                    DDE#,:::::::.:tti                                           
                    DDE#,::::.:,LttKEW                                          
                    GEEWDDK:::::jiEEDE                                 
                   DEiKDDDDDDDG,,tEEEEG                             
                  :D::DEEDDDEDGEWjEDEE.                        
                  DDtj#EDDDDDDEEE#E#EE                
                 DDE #KEDEDDDEEEEE#EE#                        
                jEDGDWEDDDDEEEEEEEEEE.                    
                GDDDDEEEEEEEKEEEEEDEE           
               GDDDDDEE#EEEEEE#WKEEE       
              iDEDDDDEWD#      WEEE      
            WDEDDDDEDEEE      iEEE              
 j    WDDEGDDDDKDEDKEEE       GEE#         
iDEDEGDDDDDEGDEDEKEKW#        WKEE#### ,,.fE;::.j;;,,,;i,,if;:E:i:,,,,;;  
:EDDGDDDDDDDDDEKE#L ##########EEEEEE###;,Gj,;,j,DG,,,,,;.:,;i:;;;,;;,,,,   
L###############################:  .,,tD,,,;;,,::,:;;t;,;i,itttiiiifffff"
mvn clean install -Dmaven.test.skip=true

echo "===================== BUILD COMPLETED! ===================\n\n"
echo "=============== COPYING exam.war  TO output ==============\n\n"

rm -rf output
mkdir output

cp ./exam-app/target/exam.war ./output/
echo "==========================================================\n\n"
echo "================= ##ALL DONE HAVE FUN!## =================\n\n"
echo "==========================================================\n\n"
