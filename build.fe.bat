@Echo off
 
Echo Bulid project begin
CALL mvn clean install -Pfe -Dmaven.test.skip=true
Echo Bulid OK


pause
