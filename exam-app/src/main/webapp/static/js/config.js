 /**
  * config
  * @global variable
  */

 window.config = {
     page: {
         STUDENT: 60,
         TEACHER: 30,
         COURSE: 25,
         IPROOM: 100,
         PAPER: 20,
         TOPIC: 15,
         EXAM: 20
     }
 };

 window.eDomain = {
     static: '',
     devMode: false,
     webroot: '',
     getURL: function(path) {
         //return this.webroot+eval("this.routerOnline."+path);
         var root = path.indexOf("/") == 0 ? "/" : this.webroot;
         path = path.replace(/^\//, "");
         if (this.devMode) {
             this.webroot = "/test/";
             var devPath = path.replace(/\//g, "");
             return this.webroot + devPath + ".json";
         }
         var onlinePath = path.replace(/\//g, ".");

         return root + eval("this.router." + onlinePath);

     },
     router: {
         college: {
             add: 'college/add.do',
             mod: "college/mod.do",
             list: 'college/list.do'
         },
         major: {
             list: 'major/list.do',
             /*by college id*/
             mod: "major/mod.do",
             add: 'major/add.do'
         },
         'class': {
             list: 'class/list.do',
             /*by major id*/
             add: 'class/add.do',
             mod: "class/mod.do"
         },
         course: {
             add: 'course/add.do',
             list: 'course/list.do',
             mod: 'course/mod.do',
             del: "course/del.do"
         },
         kpoint: {
             list: 'question/kp/tip.do'
         },
         user: {
             auth: "user/auth.do",
             info: "user/info.do"
         },
         teacher: {
             add: 'teacher/add.do',
             list: 'teacher/list.do',
             mod: 'teacher/mod.do',
             del: 'teacher/del.do',
             course: {
                 mod: 'teacher/course/mod.do',
                 list: 'teacher/course/list.do'
             },
             login: {
                 login: "teacher/login.do",
                 info: "teacher/login/user.do"
             },
             password: "teacher/password.do" //@{id,pwnew,pwold} 
         },
         student: {
             add: 'student/add.do',
             list: 'student/list.do',
             mod: 'student/mod.do',
             del: 'student/del.do',
             adds: 'student/add/batch.do'
         },
         iproom: {
             list: 'iproom/list.do',
             add: 'iproom/add.do',
             del: 'iproom/del.do',
             mod: 'iproom/mod.do'
         },
         question: {
             add: "question/add.do",
             list: 'question/list.do',
             del: 'question/del.do',
             mod: "question/mod.do"
         },
         paper: {
             add: "paper/add.do",
             list: 'paper/list.do',
             del: 'paper/del.do',
             mod: 'paper/mod.do'    
         },
         exam: {
             add: 'exam/add.do',
             mod: "exam/mod.do",
             list:"exam/list.do",
             del:"exam/del.do",
             examing: "exam/examing.do",
             status: "exam/status.do",
             student: {
                 add: 'exam/stu/add.do',
                 del: 'exam/stu/del.do',
                 list: 'exam/stu/list.do'
                //status:'exam/stu/status.do'
             }
         },
         student_exam_answer: 'student/exam/answer'
     }
 };
