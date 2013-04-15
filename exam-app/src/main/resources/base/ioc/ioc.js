var ioc = {
    config: {
        type: "cn.edu.dlnu.doe.util.PropertiesReader",
        args: ["config.properties"]
    },
    dataSourceWrite: {
        type: "com.mchange.v2.c3p0.ComboPooledDataSource",
        events: {
            depose: 'close'
        },
        fields: {
            driverClass: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("db.driver")'},
            jdbcUrl: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("db.url.write")'},
            user: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("db.user.write")'},
            password: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("db.password.write")'}
        }
    },
    dataSourceRead: {
        type: "com.mchange.v2.c3p0.ComboPooledDataSource",
        events: {
            depose: 'close'
        },
        fields: {
            driverClass: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("db.driver")'},
            jdbcUrl: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("db.url.read")'},
            user: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("db.user.read")'},
            password: {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("db.password.read")'}
        }
    },
    wDao: {
        type: "org.nutz.dao.impl.NutDao",
        args: [
            {refer: "dataSourceWrite"}
        ]
    },
    rDao: {
        type: "org.nutz.dao.impl.NutDao",
        args: [
            {refer: "dataSourceRead"}
        ]
    },
    jedisPoolConfig: {
        type: "redis.clients.jedis.JedisPoolConfig",
        fields: {
            maxActive: 20,
            maxIdle: 10,
            maxWait: 1000,
            testOnBorrow: true
        }
    },
    redisPool: {
        type: "cn.edu.dlnu.doe.redis.RedisPool",
        args: [
            {refer: "jedisPoolConfig"},
            {java: 'cn.edu.dlnu.doe.util.PropertiesReader.getProperties("redis.url")'}
        ],
        events:{
            depose:"destory"
        }
    },
    redisClient: {
        type: "cn.edu.dlnu.doe.redis.RedisClient",
        fields: {
            redisPool: {refer: "redisPool"}
        }
    },
    queue: {
        type: "cn.edu.dlnu.doe.queue.RQueueImpl",
        fields: {
            redisPool: {refer: "redisPool"}
        }
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
    loginFilter: {
        type: "cn.edu.dlnu.doe.app.filter.LoginFilter",
        events: {
            create: "init"
        }
    },

    sessionAddFilter: {
        type: "cn.edu.dlnu.doe.app.filter.SessionAddFilter"
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
            paperAction: {refer: "paperAction"},
            cache:{reder:"cache"},
        }
    },
    studentAction: {
        type: "cn.edu.dlnu.doe.app.actions.StudentAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"},
            pathUtil: {refer: "pathUtil"},
            cache: {refer: "cache"}, 
            paperAction:{refer:"paperAction"}
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
            wDao: {refer: "wDao"},
            pathUtil: {refer: "pathUtil"}
        }
    },
    stuExamAction: {
        type: "cn.edu.dlnu.doe.app.actions.stuexam.StuExamAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"},
            paperAction: {refer: "paperAction"},
            prepareExamTask: {refer: "prepareExamTask"},
            examAction: {refer: "examAction"},
            cache: {refer: "cache"},
            queue: {refer: "queue"},
            redisClient:{refer:"redisClient"},
            syncAswToDBTask:{refer:"syncAswToDBTask"}
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
            wDao: {refer: "wDao"},
            cache:{refer:"cache"},
            studentAction:{refer:"studentAction"}


        }
    },
    manageAction: {
        type: "cn.edu.dlnu.doe.app.actions.ManageAction",
        fields: {
            rDao: {refer: "rDao"},
            cache: {refer: "cache"},
            stuExamAction: {refer: "stuExamAction"}
        }
    },
    judgepaperAction: {
        type: "cn.edu.dlnu.doe.app.actions.JudgepaperAction",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"}
        }
    },
    //=======================exam task===================
    prepareExamTask: {
        type: "cn.edu.dlnu.doe.app.task.PrepareExamTask",
        fields: {
            rDao: {refer: "rDao"},
            wDao: {refer: "wDao"},
            cache: {refer: "cache"},
            paperAction: {refer: "paperAction"},
            examAction: {refer: "examAction"}
        }
    },
    syncAswToDBTask: {
        type: "cn.edu.dlnu.doe.app.task.SyncAswToDBTask",
        fields: {
            wDao: {refer: "wDao"},
            cache: {refer: "cache"},
            stuExamAction: {refer: "stuExamAction"},
            queue: {refer: "queue"},
            redisClient:{refer:"redisClient"}
        }
    },
    sessionClearTask: {
        type: "cn.edu.dlnu.doe.app.task.SessionClearTask",
        fields: {
            cache: {refer: "cache"},
            stuExamAction: {refer: "stuExamAction"}
        }
    },
    taskScheduler: {
        type: "cn.edu.dlnu.doe.app.scheduler.TaskScheduler",
        fields: {
            sessionClearTask: {refer: "sessionClearTask"},
            syncAswToDBTask:{refer:"syncAswToDBTask"}
        }
    }
}