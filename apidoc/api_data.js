define({ "api": [
  {
    "type": "post",
    "url": "/admin/notices",
    "title": "Add notice",
    "name": "CreateNotice",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the notice</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Content of the notice</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHORIZATION_FAILED",
            "description": "<p>Invalid authorization token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHORIZATION_REQUIRED",
            "description": "<p>Authorization token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHORIZATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHORIZATION_FAILED\",\n    \"message\": \"Not enough or too many segments\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHORIZATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHORIZATION_REQUIRED\",\n    \"message\": \"Authorization token is required\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "SUCCESS:",
          "content": "HTTP/1.1 204 No Content\n{\n    \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/admin/questions",
    "title": "Ask to admin",
    "name": "CreateQuestions",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.title",
            "description": "<p>Title of the question</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>An email to get a response</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.value",
            "description": "<p>Content of the question</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "SUCCESS:",
          "content": "HTTP/1.1 204 No Content\n{\n    \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "delete",
    "url": "/admin/notices/:notice-id",
    "title": "Delete notice",
    "name": "DeleteNotice",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.notice-id",
            "description": "<p>The ID of the notice</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHORIZATION_FAILED",
            "description": "<p>Invalid authorization token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHORIZATION_REQUIRED",
            "description": "<p>Authorization token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHORIZATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHORIZATION_FAILED\",\n    \"message\": \"Not enough or too many segments\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHORIZATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHORIZATION_REQUIRED\",\n    \"message\": \"Authorization token is required\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "SUCCESS:",
          "content": "HTTP/1.1 204 No Content\n{\n    \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/admin/notices/:notice-id",
    "title": "Get notice",
    "name": "GetNotice",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.limit",
            "description": "<p>Limit the number of items returned</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.offset",
            "description": "<p>Decide the start index of items returned</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "notice",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the notice</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the notice</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Content of the notice</p>"
          },
          {
            "group": "Success 200",
            "type": "DateTime",
            "optional": false,
            "field": "created_at",
            "description": "<p>The time this notice was added</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n       \"notice\": {\n           \"id\": 1,\n           \"title\": \"Important notice\",\n           \"value\": \"Fake data\",\n           \"created_at\": \"2019-03-09 13:52:38\"\n       }\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/admin/notices",
    "title": "Get notices",
    "name": "GetNotices",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.limit",
            "description": "<p>Limit the number of items returned</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.offset",
            "description": "<p>Decide the start index of items returned</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "notices",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the notice</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the notice</p>"
          },
          {
            "group": "Success 200",
            "type": "DateTime",
            "optional": false,
            "field": "created_at",
            "description": "<p>The time this notice was added</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n    \"notices\": [\n           {\n               \"id\": 1,\n               \"title\": \"Important notice\",\n               \"created_at\": \"2019-03-09 13:52:38\"\n           }\n       ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/admin/questions",
    "title": "Get questions from users",
    "name": "GetQuestions",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query.sort",
            "description": "<p>Sorting options (answered)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "questions",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the question</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the question</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value",
            "description": "<p>Content of the question</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "reply",
            "description": "<p>Answer of the question</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n    \"questions\": [\n           {\n               \"id\": 1,\n               \"title\": \"How to get authentication token?\",\n               \"email\": \"ansrl0107@gmail.com\",\n               \"value\": \"I want to use Gamepicker API\",\n               \"reply\": null\n           }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/admin/questions/:question-id/reply",
    "title": "Answer the questions from users",
    "name": "ReplyQuestions",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.questions",
            "description": "<p>The ID of the question</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.reply",
            "description": "<p>Answer of the question</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHORIZATION_FAILED",
            "description": "<p>Invalid authorization token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHORIZATION_REQUIRED",
            "description": "<p>Authorization token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHORIZATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHORIZATION_FAILED\",\n    \"message\": \"Not enough or too many segments\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHORIZATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHORIZATION_REQUIRED\",\n    \"message\": \"Authorization token is required\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "SUCCESS:",
          "content": "HTTP/1.1 204 No Content\n{\n    \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/admin/push",
    "title": "Send push notification",
    "name": "SendPushNotification",
    "group": "Admin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": ""
          }
        ]
      }
    },
    "deprecated": {
      "content": "Consider specific conditions."
    },
    "version": "0.0.0",
    "filename": "routes/admin.js",
    "groupTitle": "Admin",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-access-token",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHORIZATION_FAILED",
            "description": "<p>Invalid authorization token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHORIZATION_REQUIRED",
            "description": "<p>Authorization token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHORIZATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHORIZATION_FAILED\",\n    \"message\": \"Not enough or too many segments\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHORIZATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHORIZATION_REQUIRED\",\n    \"message\": \"Authorization token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Login",
    "name": "Login",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.password",
            "description": "<p>Password of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user_id",
            "description": "<p>The ID of this user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token of this user</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "admin",
            "description": "<p>The value to check if this user is an administrator</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "SUCCESS:",
          "content": "HTTP/1.1 200 OK\n{\n    \"user_id\": 23,\n    \"token\": \"rgewoubngkjgsdbfkhgb\"\n    \"admin\": true\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "USER_NOT_FOUND",
            "description": "<p>Can not find a user with email</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "INCORRECT_PASSWORD",
            "description": "<p>Can not find a user with email and password</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MAIL_AUTHENTICATION_FAILED",
            "description": "<p>This account is not activated by email authentication</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "INCORRECT_PASSWORD:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"INCORRECT_PASSWORD\",\n    \"message\": \"Can not find a user with email and password\"\n}",
          "type": "json"
        },
        {
          "title": "MAIL_AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"MAIL_AUTHENTICATION_FAILED\",\n    \"message\": \"This account is not activated by email authentication\"\n}",
          "type": "json"
        },
        {
          "title": "USER_NOT_FOUND:",
          "content": "HTTP/1.1 404 Not Found\n{\n    \"code\": \"USER_NOT_FOUND\",\n    \"message\": \"Can not find a user with email\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/register",
    "title": "Register",
    "name": "Register",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query.auth",
            "description": "<p>Type of social login</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.name",
            "description": "<p>Name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.password",
            "description": "<p>Password of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.birthday",
            "description": "<p>Birthday of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.Gender",
            "description": "<p>of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "Auth",
    "success": {
      "examples": [
        {
          "title": "SUCCESS:",
          "content": "HTTP/1.1 204 No Content\n{\n    \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/auth/forgot",
    "title": "Reset password",
    "name": "ResetPassword",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "body.email",
            "description": "<p>Email of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/auth.js",
    "groupTitle": "Auth",
    "success": {
      "examples": [
        {
          "title": "SUCCESS:",
          "content": "HTTP/1.1 204 No Content\n{\n    \n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "games",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "game",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "game.id",
            "description": "<p>The ID of the game</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "game.title",
            "description": "<p>Title of the game</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "game.developer",
            "description": "<p>Developer of the game</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "game.publisher",
            "description": "<p>Publisher of the game</p>"
          },
          {
            "group": "Success 200",
            "type": "DateTime",
            "optional": false,
            "field": "game.created_at",
            "description": "<p>The time the game was added</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "game.images",
            "description": "<p>Array of image links</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "game.videos",
            "description": "<p>Array of video links</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "game.platforms",
            "description": "<p>Array of platforms</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "game.score",
            "description": "<p>Average score of the game</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "game.score_count",
            "description": "<p>Number of user rate the game</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n       \"games\": [\n           {\n               \"id\": 1,\n               \"title\": \"Super Smash Bros. Melee\",\n               \"developer\": \"HAL Laboratory\",\n               \"publisher\": \"Nintendo\",\n               \"created_at\": \"2019-03-03 14:01:27\",\n               \"images\": [\n                   \"https://i.kym-cdn.com/entries/icons/original/000/026/290/maxresdefault.jpg\"\n               ],\n               \"videos\": [],\n               \"platforms\": [\n                   \"Nintendo GameCube\"\n               ],\n               \"score\": 3.84,\n               \"score_count\": 16\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "routes/games.js",
    "group": "C__develop_GamePickerAPI_routes_games_js",
    "groupTitle": "C__develop_GamePickerAPI_routes_games_js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/users/:user-id/games/comments/disrecommends",
    "title": "Get game comments user has disrecommended",
    "name": "GetGameCommentsUserDisrecommended",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.user-id",
            "description": "<p>The ID of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "comments",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "comment",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "comment.id",
            "description": "<p>The ID of the comment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "comment.value",
            "description": "<p>Content of the comment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n       \"comments\": [\n           {\n               \"id\": 81,\n               \"game_id\": 43\n               \"value\": \"This game is awesome!\"\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:user-id/games/comments/recommends",
    "title": "Get game comments user has recommended",
    "name": "GetGameCommentsUserRecommended",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.user-id",
            "description": "<p>The ID of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "comments",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "comment",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "comment.id",
            "description": "<p>The ID of the comment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "comment.value",
            "description": "<p>Content of the comment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n       \"comments\": [\n           {\n               \"id\": 81,\n               \"game_id\": 43\n               \"value\": \"This game is awesome!\"\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:user-id/games/score",
    "title": "Get game scores user rate",
    "name": "GetGameScoreUserRate",
    "group": "Users",
    "deprecated": {
      "content": "Considering change structure of API"
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.user-id",
            "description": "<p>The ID of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "games",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "game",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "game.id",
            "description": "<p>The ID of the game</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 OK\n{\n       \"games\": [\n           {\n               \"id\": 1,\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:user-id/games/follow",
    "title": "Get games user follow",
    "name": "GetGamesUserFollow",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.user-id",
            "description": "<p>The ID of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "games",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "game",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "game.id",
            "description": "<p>The ID of the game</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "game.title",
            "description": "<p>Title of the game</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "game.images",
            "description": "<p>Array of image links</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n       \"games\": [\n           {\n               \"title\": \"Super Smash Bros. Melee\",\n               \"id\": 1,\n               \"images\": [\n                   \"https://i.kym-cdn.com/entries/icons/original/000/026/290/maxresdefault.jpg\"\n               ]\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:user-id/posts/comments/disrecommends",
    "title": "Get post comments user has disrecommended",
    "name": "GetPostCommentsUserDisrecommended",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.user-id",
            "description": "<p>The ID of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.limit",
            "description": "<p>Limit the number of items returned</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.offset",
            "description": "<p>Decide the start index of items returned</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:user-id/posts/comments/recommends",
    "title": "Get post comments user has recommended",
    "name": "GetPostCommentsUserRecommended",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.user-id",
            "description": "<p>The ID of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.limit",
            "description": "<p>Limit the number of items returned</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.offset",
            "description": "<p>Decide the start index of items returned</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:user-id",
    "title": "Get user",
    "name": "GetUser",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user-id",
            "description": "<p>The ID of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "user",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.name",
            "description": "<p>Name of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "user.birthday",
            "description": "<p>Birthday of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.introduce",
            "description": "<p>Introduce of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "user.points",
            "description": "<p>Points of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.gender",
            "description": "<p>Gender of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user.profile",
            "description": "<p>Image link that provide user's profile picture</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n       \"user\": {\n           \"name\": \"smk0107\",\n           \"email\": \"ansrl0107@gmail.com\",\n           \"birthday\": \"1998-01-07\",\n           \"introduce\": null,\n           \"gender\": \"M\",\n           \"points\": 0,\n           \"profile\": null\n       }\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:user-id/games/comments",
    "title": "Get comments user created at games",
    "name": "GetUserGameComments",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "params.user-id",
            "description": "<p>The ID of the user</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "comments",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "comment",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "comment.id",
            "description": "<p>The ID of the comment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "comment.value",
            "description": "<p>Content of the comment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n       \"comments\": [\n           {\n               \"id\": 81,\n               \"game_id\": 43\n               \"value\": \"This game is awesome!\"\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users/:user-id/posts",
    "title": "Get posts user created",
    "name": "GetUserPosts",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "params",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user-id",
            "description": "<p>The ID of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.limit",
            "description": "<p>Limit the number of items returned</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "query.offset",
            "description": "<p>Decide the start index of items returned</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "posts",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Json",
            "optional": false,
            "field": "post",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "post.id",
            "description": "<p>The ID of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "post.title",
            "description": "<p>Title of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "post.views",
            "description": "<p>Views of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "DateTime",
            "optional": false,
            "field": "post.created_at",
            "description": "<p>The time the post was added</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "post.category",
            "description": "<p>Category of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "posts.recommends",
            "description": "<p>Recommends count of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "posts.disrecommends",
            "description": "<p>Disrecommends count of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "posts.comment_count",
            "description": "<p>Comment count of the post</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "posts.game_title",
            "description": "<p>Game title related the post</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "posts.game_id",
            "description": "<p>Game ID related the post</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n{\n       \"posts\": [\n           {\n               \"id\": 67,\n               \"title\": \"event test\",\n               \"views\": 3,\n               \"created_at\": \"2019-03-09 09:51:07\",\n               \"category\": \"event\",\n               \"game_title\": null,\n               \"game_id\": null,\n               \"recommends\": 0,\n               \"disrecommends\": 0,\n               \"comment_count\": 0\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get users",
    "name": "GetUsers",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query.name",
            "description": "<p>Returns the user corresponding to the name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "query.email",
            "description": "<p>Returns the user corresponding to the email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Json[]",
            "optional": false,
            "field": "users",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>The ID of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success:",
          "content": "HTTP/1.1 200 OK\n   {\n       \"users\": [\n           {\n               \"id\": 2,\n               \"email\": \"ansrl0107@gmail.com\",\n               \"name\": \"smk0107\"\n           }\n       ]\n   }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authentication token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_FAILED",
            "description": "<p>Invalid authentication token</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AUTHENTICATION_REQUIRED",
            "description": "<p>Authentication token is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "AUTHENTICATION_FAILED:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n    \"code\": \"AUTHENTICATION_FAILED\",\n    \"message\": \"Invalid authentication token\"\n}",
          "type": "json"
        },
        {
          "title": "AUTHENTICATION_REQUIRED:",
          "content": "HTTP/1.1 400 Bad Request\n{\n    \"code\": \"AUTHENTICATION_REQUIRED\",\n    \"message\": \"Authentication token is required\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
