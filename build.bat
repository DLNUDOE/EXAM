@Echo off
 
Echo Bulid project begin
CALL mvn clean install -Dmaven.test.skip=true
Echo Bulid OK

Echo Copying war to output

RD /s/q output
MD output

xcopy exam-app\target\exam.war output\
Echo All Have Done!
pause
