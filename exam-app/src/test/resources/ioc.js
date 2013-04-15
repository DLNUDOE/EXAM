var ioc = {
//    fileSQLManager:{
//      type:"org.nutz.dao.impl.FileSqlManager",
//        args:["db_doe.sql"]
//    },
// dataSource : {
//        type : "com.mchange.v2.c3p0.ComboPooledDataSource",
//        events : {
//            depose : 'close'
//        },
//        fields : {
//            driverClass : "com.mysql.jdbc.Driver",
//            jdbcUrl :"jdbc:mysql://192.168.1.118:3306/doe?useUnicode=true&characterEncoding=utf8&useServerPreStmts=true",
//            user : "root",
//            password :"asdasd"
//        }
//    },
    dataSource : {
        type : "org.nutz.dao.impl.SimpleDataSource",
        events : {
          depose : 'close'
      },
        fields : {
            jdbcUrl :"jdbc:h2:doe"
        }
    },
    wDao: {
        type: "org.nutz.dao.impl.NutDao",
        args: [
            {refer: "dataSource"}
        ]
    },
    rDao: {
        type: "org.nutz.dao.impl.NutDao",
        args: [
            {refer: "dataSource"}
        ]
    },
    //========================util==========================

    cacheFactory: {
        type: "cn.edu.dlnu.doe.util.CacheFactory",
        events: {
            depose: "shutdown"
        },
        fields: {
            address: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("cache.server")'},
            connectionPoolSize: 3
        }
    },
    cache: {
        type: "cn.edu.dlnu.doe.util.Cache",
        fields: {
            client: {java: "$cacheFactory.getCache()"}
        }
    },
    pathUtil: {
        type: "cn.edu.dlnu.doe.app.util.PathUtil",
        fields: {
            sc: {app: '$servlet'}
        }
    },
    tagTip: {
        type: "cn.edu.dlnu.doe.biz.tag.TagTip",
        events: {
            create: "init"
        }
    },
    //===================app=====================
    //filter

    authFilter: {
        type: "cn.edu.dlnu.doe.app.filter.AuthFilter",
        events: {
            create: "init"
        }
    },

    sessionAddFilter: {
        type: "cn.edu.doe.app.filter.SessionAddFilter"
    },

    //session
    sessionUtil: {
        type: "cn.edu.dlnu.doe.app.util.SessionUtil",
        fields: {
            cache: {refer: "cache"}
        }
    },

    template: {
        type: "cn.edu.dlnu.doe.app.views.DispatchView"
    },
    errorjson: {
        type: "cn.edu.dlnu.doe.app.views.ErrorJsonView"
    },

    tmpFilePool: {
        type: 'org.nutz.filepool.NutFilePool',
        // 临时文件最大个数为 1000 个
        //args : [ "~/upload/tmps", 1000 ] 
        args: [
            {java: '$pathUtil.getPath("/WEB-INF/tmp")'},
            1000
        ]   // 调用 MyUtils.getPath 函数
    },
    uploadFileContext: {
        type: 'org.nutz.mvc.upload.UploadingContext',
        singleton: false,
        args: [
            { refer: 'tmpFilePool' }
        ],
        fields: {
            // 是否忽略空文件, 默认为 false
            ignoreNull: true,
            // 单个文件最大尺寸(大约的值，单位为字节，即 1048576 为 1M)
            maxFileSize: 1048576,
            // 正则表达式匹配可以支持的文件名
            nameFilter: '^(.+[.])(xls)$'
        }
    },
    fileUpload: {
        type: 'org.nutz.mvc.upload.UploadAdaptor',
        singleton: false,
        args: [
            { refer: 'uploadFileContext' }
        ]
    },
    collegeAction: {
        type: "cn.edu.dlnu.doe.app.actions.CollegeAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"}
        }
    },
    majorAction: {
        type: "cn.edu.dlnu.doe.app.actions.MajorAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"}
        }
    },
    classAction: {
        type: "cn.edu.dlnu.doe.app.actions.ClassAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"}
        }
    },
    teacherAction: {
        type: "cn.edu.dlnu.doe.app.actions.TeacherAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"},
            paperAction: {refer: "paperAction"}
        }
    },
    studentAction: {
        type: "cn.edu.dlnu.doe.app.actions.StudentAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"},
            pathUtil: {refer: "pathUtil"},
            cache: {refer: "cache"}
        }

    },
    courseAction: {
        type: "cn.edu.dlnu.doe.app.actions.CourseAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"}
        }
    },
    ipRoomAction: {
        type: "cn.edu.dlnu.doe.app.actions.IpRoomAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"}
        }
    },
    questionAction: {
        type: "cn.edu.dlnu.doe.app.actions.QuestionAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"}
        }
    },
    paperAction: {
        type: "cn.edu.dlnu.doe.app.actions.PaperAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"},
            cache: {refer: "cache"}
        }
    },
    examAction: {
        type: "cn.edu.dlnu.doe.app.actions.ExamAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"}
        }
    }
}