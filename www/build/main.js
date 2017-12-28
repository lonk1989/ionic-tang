webpackJsonp([0],{

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Helper; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__NativeService__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__typings_modules_jpush_index__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Constants__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__FileService__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Utils__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Logger__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_fundebug_javascript__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_fundebug_javascript___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_fundebug_javascript__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by yanxiaojun617@163.com on 12-27.
 */












/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
var Helper = (function () {
    function Helper(jPush, logger, fileService, nativeService, storage, events, globalData) {
        this.jPush = jPush;
        this.logger = logger;
        this.fileService = fileService;
        this.nativeService = nativeService;
        this.storage = storage;
        this.events = events;
        this.globalData = globalData;
    }
    /**
     * 设置日志监控app的版本号
     */
    Helper.prototype.funDebugInit = function () {
        if (this.nativeService.isMobile()) {
            this.nativeService.getVersionNumber().subscribe(function (version) {
                __WEBPACK_IMPORTED_MODULE_11_fundebug_javascript__["appversion"] = version;
            });
        }
    };
    /**
     * AlloyLever,一款本地"开发者工具"
     * 文档:https://github.com/AlloyTeam/AlloyLever
     */
    Helper.prototype.alloyLeverInit = function () {
        AlloyLever.config({
            cdn: 'http://s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js',
        });
    };
    /**
     * 获取用户头像路径
     * @param avatarId
     */
    Helper.prototype.loadAvatarPath = function (avatarId) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_4_rxjs__["Observable"].create(function (observer) {
            if (!avatarId) {
                observer.next(__WEBPACK_IMPORTED_MODULE_5__Constants__["d" /* DEFAULT_AVATAR */]);
            }
            else {
                _this.fileService.getFileInfoById(avatarId).subscribe(function (res) {
                    if (res.origPath) {
                        var avatarPath = res.origPath;
                        observer.next(avatarPath);
                    }
                    else {
                        observer.next(__WEBPACK_IMPORTED_MODULE_5__Constants__["d" /* DEFAULT_AVATAR */]);
                    }
                }, function () {
                    observer.next(__WEBPACK_IMPORTED_MODULE_5__Constants__["d" /* DEFAULT_AVATAR */]);
                });
            }
        });
    };
    /**
     * 登录成功处理
     */
    Helper.prototype.loginSuccessHandle = function (userInfo) {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_7__Utils__["a" /* Utils */].sessionStorageClear(); //清除数据缓存
        this.globalData.user = userInfo;
        this.globalData.userId = userInfo.id;
        this.globalData.phone = userInfo.phone;
        this.storage.get('enabled-file-cache-' + userInfo.id).then(function (res) {
            if (res === false) {
                _this.globalData.enabledFileCache = false;
            }
        });
        this.loadAvatarPath(userInfo.avatarId).subscribe(function (avatarPath) {
            userInfo.avatarPath = avatarPath;
            _this.globalData.user.avatarPath = avatarPath;
        });
        this.setTags();
        this.setAlias();
        this.events.publish('user:login', userInfo);
    };
    /**
     * 从文件对象数组中找出指定id对应的文件对象
     * @param fileList 文件对象数组
     * @param idList id数组
     */
    Helper.findFileListById = function (fileList, ids) {
        if (!ids || ids.length == 0) {
            return [];
        }
        var newFileList = [];
        for (var _i = 0, fileList_1 = fileList; _i < fileList_1.length; _i++) {
            var file = fileList_1[_i];
            for (var _a = 0, ids_1 = ids; _a < ids_1.length; _a++) {
                var id = ids_1[_a];
                if (file.id == id) {
                    newFileList.push(file);
                }
            }
        }
        return newFileList;
    };
    /**
     * 上传文件返回文件id
     */
    Helper.prototype.uploadPictureByPath = function (fileList) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_4_rxjs__["Observable"].create(function (observer) {
            if (!fileList || fileList.length == 0) {
                observer.next([]);
                return;
            }
            var fileIds = [];
            var uploadFileList = [];
            for (var _i = 0, fileList_2 = fileList; _i < fileList_2.length; _i++) {
                var fileObj = fileList_2[_i];
                if (fileObj.id) {
                    fileIds.push(fileObj.id);
                }
                else {
                    fileObj.parameter = fileObj.origPath;
                    uploadFileList.push(fileObj);
                }
            }
            _this.globalData.showLoading = false;
            _this.fileService.uploadMultiByFilePath(uploadFileList).subscribe(function (fileList) {
                for (var _i = 0, fileList_3 = fileList; _i < fileList_3.length; _i++) {
                    var fileObj = fileList_3[_i];
                    fileIds.push(fileObj.id);
                }
                observer.next(fileIds);
            });
        });
    };
    /**
     * 极光推送
     */
    Helper.prototype.initJpush = function () {
        if (!this.nativeService.isMobile()) {
            return;
        }
        this.jPush.init();
        if (this.nativeService.isIos()) {
            this.jPush.setDebugModeFromIos();
        }
        else {
            this.jPush.setDebugMode(true);
        }
        this.jPushAddEventListener();
    };
    Helper.prototype.jPushAddEventListener = function () {
        var _this = this;
        this.jPush.getUserNotificationSettings().then(function (result) {
            if (result == 0) {
                console.log('系统设置中已关闭应用推送');
            }
            else if (result > 0) {
                console.log('系统设置中打开了应用推送');
            }
        });
        //点击通知进入应用程序时会触发的事件
        document.addEventListener("jpush.openNotification", function (event) {
            _this.setIosIconBadgeNumber(0);
            var content = _this.nativeService.isIos() ? event['aps'].alert : event['alert'];
            console.log("jpush.openNotification" + content);
        }, false);
        //收到通知时会触发该事件
        document.addEventListener("jpush.receiveNotification", function (event) {
            var content = _this.nativeService.isIos() ? event['aps'].alert : event['alert'];
            console.log("jpush.receiveNotification" + content);
        }, false);
        //收到自定义消息时触发这个事件
        document.addEventListener("jpush.receiveMessage", function (event) {
            var message = _this.nativeService.isIos() ? event['content'] : event['message'];
            console.log("jpush.receiveMessage" + message);
        }, false);
        //设置标签/别名回调函数
        document.addEventListener("jpush.setTagsWithAlias", function (event) {
            console.log("onTagsWithAlias");
            var result = "result code:" + event['resultCode'] + " ";
            result += "tags:" + event['tags'] + " ";
            result += "alias:" + event['alias'] + " ";
            console.log(result);
        }, false);
    };
    //设置标签
    Helper.prototype.setTags = function () {
        if (!this.nativeService.isMobile()) {
            return;
        }
        var tags = [];
        if (this.nativeService.isAndroid()) {
            tags.push('android');
        }
        if (this.nativeService.isIos()) {
            tags.push('ios');
        }
        console.log('设置setTags:' + tags);
        this.jPush.setTags(tags);
    };
    //设置别名,一个用户只有一个别名
    Helper.prototype.setAlias = function () {
        if (!this.nativeService.isMobile()) {
            return;
        }
        console.log('设置setAlias:' + this.globalData.userId);
        this.jPush.setAlias('' + this.globalData.userId); //ios设置setAlias有bug,值必须为string类型,不能是number
    };
    Helper.prototype.setTagsWithAlias = function (userId) {
        if (!this.nativeService.isMobile()) {
            return;
        }
        console.log('设置setTagsWithAlias:' + userId);
        this.jPush.setTagsWithAlias(['man', 'test'], '' + userId);
    };
    //设置ios角标数量
    Helper.prototype.setIosIconBadgeNumber = function (badgeNumber) {
        if (this.nativeService.isIos()) {
            this.jPush.setBadge(badgeNumber); //上传badge值到jPush服务器
            this.jPush.setApplicationIconBadgeNumber(badgeNumber); //设置应用badge值
        }
    };
    return Helper;
}());
Helper = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__typings_modules_jpush_index__["a" /* JPush */],
        __WEBPACK_IMPORTED_MODULE_8__Logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_6__FileService__["a" /* FileService */],
        __WEBPACK_IMPORTED_MODULE_2__NativeService__["a" /* NativeService */],
        __WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_9_ionic_angular__["e" /* Events */],
        __WEBPACK_IMPORTED_MODULE_10__GlobalData__["a" /* GlobalData */]])
], Helper);

//# sourceMappingURL=Helper.js.map

/***/ }),

/***/ 146:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FileService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HttpService__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Constants__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__NativeService__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Utils__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(61);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by yanxiaojun617@163.com on 12-23.
 */








/**
 * 上传图片到文件服务器
 */
var FileService = FileService_1 = (function () {
    function FileService(httpService, nativeService, storage, globalData) {
        this.httpService = httpService;
        this.nativeService = nativeService;
        this.storage = storage;
        this.globalData = globalData;
    }
    /**
     * 根据文件id删除文件信息
     * @param id
     * @returns {FileObj}
     */
    FileService.prototype.deleteById = function (id) {
        if (!id) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of({});
        }
        this.deleteFileCacheByIds([id]);
        return this.httpService.get(__WEBPACK_IMPORTED_MODULE_2__Constants__["e" /* FILE_SERVE_URL */] + '/deleteById', { id: id });
    };
    /**
     * 根据ids(文件数组)获取文件信息
     * 先从本地缓存中查找文件,然后再去文件服务器上查找文件
     * @param ids
     * @returns {FileObj[]}
     */
    FileService.prototype.getFileInfoByIds = function (ids) {
        var _this = this;
        if (!ids || ids.length == 0) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of([]);
        }
        return this.getFileCacheByIds(ids).mergeMap(function (cacheData) {
            var queryIds = FileService_1.getNotCacheIds(cacheData, ids);
            if (queryIds.length == 0) {
                return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(cacheData);
            }
            return _this.httpService.get(__WEBPACK_IMPORTED_MODULE_2__Constants__["e" /* FILE_SERVE_URL */] + '/getByIds', { ids: queryIds }).map(function (result) {
                if (!result.success) {
                    _this.nativeService.alert(result.msg);
                    return [].concat(cacheData);
                }
                else {
                    for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                        var fileObj = _a[_i];
                        fileObj.origPath = __WEBPACK_IMPORTED_MODULE_2__Constants__["e" /* FILE_SERVE_URL */] + fileObj.origPath;
                        fileObj.thumbPath = __WEBPACK_IMPORTED_MODULE_2__Constants__["e" /* FILE_SERVE_URL */] + fileObj.thumbPath;
                    }
                    return cacheData.concat(result.data);
                }
            });
        });
    };
    /**
     * 根据文件id获取文件信息
     * @param id
     * @returns {FileObj}
     */
    FileService.prototype.getFileInfoById = function (id) {
        if (!id) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of({});
        }
        return this.getFileInfoByIds([id]).map(function (res) {
            return res[0] || {};
        });
    };
    /**
     * 根据base64(字符串)批量上传图片
     * @param fileObjList 数组中的对象必须包含bse64属性
     * @returns {FileObj[]}
     */
    FileService.prototype.uploadMultiByBase64 = function (fileObjList) {
        var _this = this;
        if (!fileObjList || fileObjList.length == 0) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of([]);
        }
        return this.httpService.post(__WEBPACK_IMPORTED_MODULE_2__Constants__["e" /* FILE_SERVE_URL */] + '/appUpload?directory=ionic2_tabs', fileObjList).map(function (result) {
            if (!result.success) {
                _this.nativeService.alert(result.msg);
                return [];
            }
            else {
                for (var _i = 0, _a = result.data; _i < _a.length; _i++) {
                    var fileObj = _a[_i];
                    fileObj.origPath = __WEBPACK_IMPORTED_MODULE_2__Constants__["e" /* FILE_SERVE_URL */] + fileObj.origPath;
                    fileObj.thumbPath = __WEBPACK_IMPORTED_MODULE_2__Constants__["e" /* FILE_SERVE_URL */] + fileObj.thumbPath;
                }
                return result.data;
            }
        });
    };
    /**
     * 根据base64(字符串)上传单张图片
     * @param fileObj 对象必须包含origPath属性
     * @returns {FileObj}
     */
    FileService.prototype.uploadByBase64 = function (fileObj) {
        if (!fileObj.base64) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of({});
        }
        return this.uploadMultiByBase64([fileObj]).map(function (res) {
            return res[0] || {};
        });
    };
    /**
     *  根据filePath(文件路径)批量上传图片
     * @param fileObjList 数组中的对象必须包含origPath属性
     * @returns {FileObj[]}
     */
    FileService.prototype.uploadMultiByFilePath = function (fileObjList) {
        var _this = this;
        if (fileObjList.length == 0) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of([]);
        }
        //开启了缓存
        if (this.globalData.enabledFileCache) {
            for (var _i = 0, fileObjList_1 = fileObjList; _i < fileObjList_1.length; _i++) {
                var fileObj = fileObjList_1[_i];
                //生成一个临时id,待真正上传到后台需要替换掉临时id
                fileObj.id = FileService_1.uuid();
            }
            var cacheKey_1 = 'file-cache-' + this.globalData.userId;
            this.storage.get(cacheKey_1).then(function (cacheData) {
                cacheData = cacheData ? cacheData.concat(fileObjList) : fileObjList;
                //缓存文件信息
                _this.storage.set(cacheKey_1, cacheData);
            });
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of(fileObjList);
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].create(function (observer) {
                _this.nativeService.showLoading();
                var fileObjs = [];
                var _loop_1 = function (fileObj) {
                    _this.nativeService.convertImgToBase64(fileObj.origPath).subscribe(function (base64) {
                        fileObjs.push({
                            'base64': base64,
                            'type': FileService_1.getFileType(fileObj.origPath),
                            'parameter': fileObj.parameter
                        });
                        if (fileObjs.length === fileObjList.length) {
                            _this.uploadMultiByBase64(fileObjs).subscribe(function (res) {
                                observer.next(res);
                                _this.nativeService.hideLoading();
                            });
                        }
                    });
                };
                for (var _i = 0, fileObjList_2 = fileObjList; _i < fileObjList_2.length; _i++) {
                    var fileObj = fileObjList_2[_i];
                    _loop_1(fileObj);
                }
            });
        }
    };
    /**
     * 根据filePath(文件路径)上传单张图片
     * @param fileObj 对象必须包含origPath属性
     * @returns {FileObj}
     */
    FileService.prototype.uploadByFilePath = function (fileObj) {
        if (!fileObj.origPath) {
            return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].of({});
        }
        return this.uploadMultiByFilePath([fileObj]).map(function (res) {
            return res[0] || {};
        });
    };
    //根据ids从文件缓存中查询文件信息
    FileService.prototype.getFileCacheByIds = function (ids) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_3_rxjs__["Observable"].create(function (observer) {
            var result = [];
            var cacheKey = 'file-cache-' + _this.globalData.userId;
            _this.storage.get(cacheKey).then(function (cacheData) {
                cacheData = cacheData ? cacheData : [];
                for (var _i = 0, cacheData_1 = cacheData; _i < cacheData_1.length; _i++) {
                    var cache = cacheData_1[_i];
                    for (var _a = 0, ids_1 = ids; _a < ids_1.length; _a++) {
                        var id = ids_1[_a];
                        if (id == cache.id) {
                            result.push(cache);
                        }
                    }
                }
                observer.next(result);
            });
        });
    };
    //查询没有缓存的文件id数组
    FileService.getNotCacheIds = function (cacheData, ids) {
        var result = [];
        for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
            var id = ids_2[_i];
            var isExist = false;
            for (var _a = 0, cacheData_2 = cacheData; _a < cacheData_2.length; _a++) {
                var cache = cacheData_2[_a];
                if (id == cache.id) {
                    isExist = true;
                }
            }
            if (!isExist) {
                result.push(id);
            }
        }
        return result;
    };
    //根据文件后缀获取文件类型
    FileService.getFileType = function (path) {
        return path.substring(path.lastIndexOf('.') + 1);
    };
    //获取uuid,前缀为'r_'代表缓存文件
    FileService.uuid = function () {
        var uuid = __WEBPACK_IMPORTED_MODULE_6__Utils__["a" /* Utils */].uuid();
        return 'r_' + uuid.substring(2);
    };
    //根据文件id数组从缓存中删除文件
    FileService.prototype.deleteFileCacheByIds = function (ids) {
        var _this = this;
        var cacheKey = 'file-cache-' + this.globalData.userId;
        this.storage.get(cacheKey).then(function (cacheData) {
            var newCacheData = [];
            for (var _i = 0, cacheData_3 = cacheData; _i < cacheData_3.length; _i++) {
                var fileObj = cacheData_3[_i];
                var isExist = false;
                for (var _a = 0, ids_3 = ids; _a < ids_3.length; _a++) {
                    var id = ids_3[_a];
                    if (fileObj.id == id) {
                        isExist = true;
                    }
                }
                if (!isExist) {
                    newCacheData.push(fileObj);
                }
            }
            _this.storage.set(cacheKey, newCacheData);
        });
    };
    return FileService;
}());
FileService = FileService_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__HttpService__["a" /* HttpService */],
        __WEBPACK_IMPORTED_MODULE_4__NativeService__["a" /* NativeService */],
        __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_5__GlobalData__["a" /* GlobalData */]])
], FileService);

var FileService_1;
//# sourceMappingURL=FileService.js.map

/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MoreModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disease_detail_disease_detail__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_CommonService__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__doctor_doctor__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_platform_browser__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__doctor_list_doctor_list__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__department_department__ = __webpack_require__(296);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







// import { DomSanitizer } from '@angular/platform-browser/src/security/dom_sanitization_service';



var HomePage = (function () {
    function HomePage(navCtrl, modalCtrl, commonService, events, globalData, sanitizer) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.commonService = commonService;
        this.events = events;
        this.globalData = globalData;
        this.sanitizer = sanitizer;
        this.events.subscribe('user:login', function (userInfo) {
            _this.commonService.getSicknessList().subscribe(function (resp) {
                _this.sicknessList = resp.data;
                _this.sicknessFirstLine = resp.data.slice(0, 7);
            });
            _this.commonService.getDoctorList().subscribe(function (resp) {
                resp.data.map(function (o) {
                    o.rank = o.rank.toString().replace('0', '').replace('1', '主任医师').replace('2', '副主任医师').replace('3', '主治医师').replace('4', '住院医师').replace('5', '医师');
                });
                _this.doctorList = resp.data.slice(0, 6);
            });
        });
    }
    HomePage.prototype.assembleHTML = function (strHTML) {
        return this.sanitizer.bypassSecurityTrustHtml(strHTML);
    };
    HomePage.prototype.search = function () {
        console.log('search');
    };
    HomePage.prototype.startModalPage = function () {
    };
    HomePage.prototype.startPage = function (sickName) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__disease_detail_disease_detail__["a" /* DiseaseDetailPage */], sickName);
    };
    HomePage.prototype.startDoctorPage = function (id) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__doctor_doctor__["a" /* DoctorPage */], { id: id });
    };
    HomePage.prototype.startDoctorListPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__doctor_list_doctor_list__["a" /* DoctorListPage */]);
    };
    HomePage.prototype.startSicknessPage = function () {
        this.navCtrl.push(MoreModal, { arrList: this.sicknessList });
    };
    HomePage.prototype.startDepartmentPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__department_department__["a" /* DepartmentPage */]);
    };
    HomePage.prototype.startMoreModal = function () {
        var modal = this.modalCtrl.create(MoreModal, { arrList: this.sicknessList });
        modal.present();
    };
    return HomePage;
}());
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>医馆</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div class="yzt-header">\n    <img src="assets/imgs/header.png" />\n  </div>\n  <ion-searchbar (ionInput)="search($event)" placeholder="输入症状、专家、经方"></ion-searchbar>\n  <ion-slides pager loop autoplay="3000">\n    <ion-slide>\n      <img src="assets/imgs/slider-1.jpg" class="slide-image"/>\n    </ion-slide>\n    <ion-slide>\n      <img src="assets/imgs/slider-2.jpg" class="slide-image"/>\n    </ion-slide>\n    <ion-slide>\n      <img src="assets/imgs/slider-3.jpg" class="slide-image"/>\n    </ion-slide>\n  </ion-slides>\n  <img class="tang-line" src="assets/imgs/tang-line.png"/>\n  <ion-grid class="home-menu-top">\n    <ion-row>\n      <ion-col col-3 (click)="startSicknessPage()" text-center>\n        <img src="assets/imgs/menu-1.png" />\n        <p>症状</p>\n      </ion-col>\n      <ion-col col-3 (click)="startDepartmentPage()" text-center>\n        <img src="assets/imgs/menu-2.png" />\n        <p>科室</p>\n      </ion-col>\n      <ion-col col-3 (click)="startDoctorListPage()" text-center>\n        <img src="assets/imgs/menu-3.png" />\n        <p>专家</p>\n      </ion-col>\n      <ion-col col-3 (click)="startPage()" text-center>\n        <img src="assets/imgs/menu-4.png" />\n        <p>经方</p>\n      </ion-col>\n    </ion-row>\n    <ion-row>\n      <ion-col col-3 (click)="startPage()" text-center>\n        <img src="assets/imgs/menu-5.png" />\n        <p>健康</p>\n      </ion-col>\n      <ion-col col-3 (click)="startPage()" text-center>\n        <img src="assets/imgs/menu-6.png" />\n        <p>养生</p>\n      </ion-col>\n      <ion-col col-3 (click)="startPage()" text-center>\n        <img src="assets/imgs/menu-7.png" />\n        <p>客服</p>\n      </ion-col>\n      <ion-col col-3 (click)="startMoreModal()" text-center>\n        <img src="assets/imgs/menu-8.png" />\n        <p>更多</p>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n  <img class="tang-line" src="assets/imgs/tang-line.png"/>\n  <ion-grid class="home-menu">\n    <ion-row>\n      <ion-col col-3 (click)="startPage(item.name)" *ngFor="let item of sicknessFirstLine">\n        <img [src]="item.icon" />\n        <p>{{item.name}}</p>\n      </ion-col>\n      <ion-col col-3 (click)="startMoreModal()">\n        <img src="assets/imgs/more.png" />\n        <p>更多</p>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n  <img class="tang-line" src="assets/imgs/tang-line.png"/>\n  <ion-list class="home-doctor">\n    <div ion-item text-center no-lines>\n      <img src="assets/imgs/recommend.png" style="width:120px;height:auto;"/>\n    </div>\n  <ion-grid>\n    <ion-row>\n      <ion-col col-6 (click)="startDoctorPage(item.id)" *ngFor="let item of doctorList">\n        <div ion-item text-center no-lines no-padding class="doctor-list">\n          <img [src]="item.avatar" style="height:auto;">\n          <h2>{{item.name}} </h2>\n          <!-- <p><small>{{item.hospital}}{{item.rank}}</small></p> -->\n          <div text-wrap class="pmain_text" [innerHTML]="assembleHTML(item.intro)"></div>\n        </div>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n    <button ion-item text-right (click)="startDoctorListPage()" no-lines>全部专家</button>\n    <!-- <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-2.png">\n      </ion-thumbnail>\n      <h2>李医师 <small>主任医师</small></h2>\n      <p><small>仁济医院（三甲）</small></p>\n      <p><em>1800</em> 人付款，<em>190</em> 条评价</p>\n      <p text-wrap>脾胃不足，百病之始</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-1.png">\n      </ion-thumbnail>\n      <h2>张医师 <small>主任医师</small></h2>\n      <p><small>仁济医院（三甲）</small></p>\n      <p><em>1800</em> 人付款，<em>190</em> 条评价</p>\n      <p text-wrap>脾胃不足，百病之始</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-2.png">\n      </ion-thumbnail>\n      <h2>莉医师 <small>主任医师</small></h2>\n      <p><small>仁济医院（三甲）</small></p>\n      <p><em>1800</em> 人付款，<em>190</em> 条评价</p>\n      <p text-wrap>脾胃不足，百病之始</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-1.png">\n      </ion-thumbnail>\n      <h2>黄医师 <small>主任医师</small></h2>\n      <p><small>仁济医院（三甲）</small></p>\n      <p><em>1800</em> 人付款，<em>190</em> 条评价</p>\n      <p text-wrap>脾胃不足，百病之始</p>\n    </button> -->\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */], __WEBPACK_IMPORTED_MODULE_3__service_CommonService__["a" /* CommonService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* Events */], __WEBPACK_IMPORTED_MODULE_5__providers_GlobalData__["a" /* GlobalData */], __WEBPACK_IMPORTED_MODULE_6__angular_platform_browser__["c" /* DomSanitizer */]])
], HomePage);

var MoreModal = (function () {
    function MoreModal(params, viewCtrl, navCtrl) {
        this.params = params;
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
        this.sicknessList = this.params.get('arrList');
    }
    MoreModal.prototype.startPage = function (sickName) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__disease_detail_disease_detail__["a" /* DiseaseDetailPage */], sickName);
    };
    MoreModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    return MoreModal;
}());
MoreModal = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-home',
        template: "\n    <ion-header>\n      <ion-toolbar>\n        <ion-buttons start>\n          <button ion-button (click)=\"dismiss()\">\n            <ion-icon name=\"md-close\"></ion-icon>\n          </button>\n        </ion-buttons>\n      </ion-toolbar>\n    </ion-header>\n    <ion-content>\n      <ion-grid class=\"home-menu\">\n        <ion-row>\n          <ion-col col-3 *ngFor=\"let item of sicknessList\" (click)=\"startPage(item.name)\">\n            <img [src]=\"item.icon\" />\n            <p>{{item.name}}</p>\n          </ion-col>\n        </ion-row>\n      </ion-grid>\n    </ion-content>\n    "
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */]])
], MoreModal);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 159:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 159;

/***/ }),

/***/ 203:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 203;

/***/ }),

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JPush; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ionic_native_core__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
  };


/**
 * @name JPush
 * @description
 * This plugin does something
 *
 * @usage
 * ```
 * import { JPush } from 'ionic-native';
 *
 * JPush.functionName('Hello', 123)
 *   .then((something: any) => doSomething(something))
 *   .catch((error: any) => console.log(error));
 *
 * ```
 */
var JPush = (function () {
  function JPush() {
  }

  JPush.prototype.init = function () {
    return; // We add return; here to avoid any IDE / Compiler errors
  };
  JPush.prototype.stopPush = function () {
    return;
  };
  JPush.prototype.resumePush = function () {
    return;
  };
  JPush.prototype.isPushStopped = function () {
    return;
  };
  JPush.prototype.getRegistrationID = function () {
    return;
  };
  JPush.prototype.setTagsWithAlias = function (tags, alias) {
    return;
  };
  JPush.prototype.setTags = function (tags) {
    return;
  };
  JPush.prototype.setAlias = function (alias) {
    return;
  };
  JPush.prototype.setBadge = function (badgeNum) {
    return;
  };
  JPush.prototype.setApplicationIconBadgeNumber = function (badgeNum) {
    return;
  };
  JPush.prototype.openNotification = function () {
    return;
  };
  JPush.prototype.receiveNotification = function () {
    return;
  };
  JPush.prototype.receiveMessage = function () {
    return;
  };
  JPush.prototype.getUserNotificationSettings = function () {
    return;
  };
  JPush.prototype.setDebugModeFromIos = function () {
    return;
  };
  JPush.prototype.setDebugMode = function (isDebug) {
    return;
  };

  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "init", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "stopPush", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "resumePush", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "isPushStopped", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "getRegistrationID", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Array, String]),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "setTagsWithAlias", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Array]),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "setTags", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [String]),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "setAlias", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "setBadge", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', [Number]),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "setApplicationIconBadgeNumber", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])({
      eventObservable: true,
      event: 'jpush.openNotification',
      element: document
    }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"])
  ], JPush.prototype, "openNotification", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])({
      eventObservable: true,
      event: 'jpush.receiveNotification',
      element: document
    }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"])
  ], JPush.prototype, "receiveNotification", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])({
      eventObservable: true,
      event: 'jpush.receiveMessage',
      element: document
    }),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"])
  ], JPush.prototype, "receiveMessage", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "getUserNotificationSettings", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "setDebugModeFromIos", null);
  __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["a" /* Cordova */])(),
    __metadata('design:type', Function),
    __metadata('design:paramtypes', []),
    __metadata('design:returntype', Promise)
  ], JPush.prototype, "setDebugMode", null);


  JPush = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__ionic_native_core__["g" /* Plugin */])({
      pluginName: 'JPush',
      plugin: 'jpush-phonegap-plugin',
      pluginRef: 'plugins.jPushPlugin',
      repo: 'https://github.com/jpush/jpush-phonegap-plugin',
    }),
    __metadata('design:paramtypes', [])
  ], JPush);
  return JPush;
}());
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 283:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VersionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_file_transfer__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Logger__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Constants__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Utils__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__HttpService__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__NativeService__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__FileService__ = __webpack_require__(146);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var VersionService = (function () {
    function VersionService(nativeService, transfer, file, httpService, fileService, alertCtrl, logger) {
        this.nativeService = nativeService;
        this.transfer = transfer;
        this.file = file;
        this.httpService = httpService;
        this.fileService = fileService;
        this.alertCtrl = alertCtrl;
        this.logger = logger;
        this.isMobile = false; //是否移动端
        //app更新进度.默认为0,在app升级过程中会改变
        this.updateProgress = -1;
        this.isInit = true; //是否正在初始化
    }
    VersionService.prototype.init = function () {
        var _this = this;
        this.isMobile = this.nativeService.isMobile();
        if (this.isMobile) {
            this.nativeService.getVersionNumber().subscribe(function (currentVersionNo) {
                _this.currentVersionNo = currentVersionNo;
            });
            this.nativeService.getPackageName().subscribe(function (packageName) {
                _this.appName = packageName.substring(packageName.lastIndexOf('.') + 1);
                _this.appType = _this.nativeService.isAndroid() ? 'android' : 'ios';
                _this.appDownloadPageUrl = __WEBPACK_IMPORTED_MODULE_6__Constants__["e" /* FILE_SERVE_URL */] + '/static/download.html?name=' + _this.appName;
                //从后台查询app最新版本信息
                var url = __WEBPACK_IMPORTED_MODULE_7__Utils__["a" /* Utils */].formatUrl(__WEBPACK_IMPORTED_MODULE_6__Constants__["b" /* APP_VERSION_SERVE_URL */] + "/v1/apply/getDownloadPageByEName/" + _this.appName + "/" + _this.appType);
                _this.httpService.get(url).subscribe(function (res) {
                    _this.isInit = false; //初始化完成
                    if (res && res.code == 1 && res.data && res.data.lastVersion) {
                        var data = res.data;
                        _this.lastVersionInfo = data.lastVersion;
                        _this.latestVersionNo = data.lastVersion.version;
                        for (var _i = 0, _a = data.fileRelationList; _i < _a.length; _i++) {
                            var fileRelation = _a[_i];
                            if (fileRelation.type == 'apk') {
                                _this.fileService.getFileInfoById(fileRelation.fileId).subscribe(function (res) {
                                    _this.apkUrl = res.origPath;
                                });
                            }
                        }
                    }
                }, function (err) {
                    _this.logger.log(err, '从版本升级服务获取版本信息失败', { url: url });
                    _this.isInit = false; //初始化完成
                });
            });
        }
    };
    VersionService.prototype.getCurrentVersionNo = function () {
        return this.currentVersionNo;
    };
    VersionService.prototype.getLatestVersionNo = function () {
        return this.latestVersionNo;
    };
    VersionService.prototype.getLastVersionInfo = function () {
        return this.lastVersionInfo;
    };
    /**
     * 是否需要升级
     */
    VersionService.prototype.assertUpgrade = function () {
        var _this = this;
        if (this.isMobile) {
            if (this.isInit) {
                setTimeout(function () {
                    _this.assertUpgrade();
                }, 5000);
            }
            else {
                if (this.latestVersionNo && (this.currentVersionNo != this.latestVersionNo)) {
                    var that_1 = this;
                    if (this.lastVersionInfo.isForcedUpdate == 1) {
                        this.alertCtrl.create({
                            title: '重要升级',
                            subTitle: '您必须升级后才能使用！',
                            enableBackdropDismiss: false,
                            buttons: [{
                                    text: '确定', handler: function () {
                                        that_1.downloadApp();
                                    }
                                }
                            ]
                        }).present();
                    }
                    else {
                        this.alertCtrl.create({
                            title: '升级',
                            subTitle: '发现新版本,是否立即升级？',
                            enableBackdropDismiss: false,
                            buttons: [{ text: '取消' }, {
                                    text: '确定', handler: function () {
                                        that_1.downloadApp();
                                    }
                                }]
                        }).present();
                    }
                }
            }
        }
    };
    /**
     * 下载app
     */
    VersionService.prototype.downloadApp = function () {
        var _this = this;
        if (this.nativeService.isIos()) {
            this.nativeService.openUrlByBrowser(this.appDownloadPageUrl);
        }
        if (this.nativeService.isAndroid()) {
            if (!this.apkUrl) {
                this.nativeService.alert('未找到android apk下载地址');
                return;
            }
            this.nativeService.externalStoragePermissionsAuthorization().subscribe(function () {
                var backgroundProcess = false; //是否后台下载
                var alert = _this.alertCtrl.create({
                    title: '下载进度：0%',
                    enableBackdropDismiss: false,
                    buttons: [{
                            text: '后台下载', handler: function () {
                                backgroundProcess = true;
                            }
                        }
                    ]
                });
                alert.present();
                var fileTransfer = _this.transfer.create();
                var apk = _this.file.externalRootDirectory + 'download/' + ("android_" + __WEBPACK_IMPORTED_MODULE_7__Utils__["a" /* Utils */].getSequence() + ".apk"); //apk保存的目录
                //下载并安装apk
                fileTransfer.download(_this.apkUrl, apk).then(function () {
                    window['install'].install(apk.replace('file://', ''));
                }, function (err) {
                    _this.updateProgress = -1;
                    alert && alert.dismiss();
                    _this.logger.log(err, 'android app 本地升级失败');
                    _this.alertCtrl.create({
                        title: '前往网页下载',
                        subTitle: '本地升级失败',
                        buttons: [{
                                text: '确定', handler: function () {
                                    _this.nativeService.openUrlByBrowser(_this.appDownloadPageUrl); //打开网页下载
                                }
                            }
                        ]
                    }).present();
                });
                var timer = null; //由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
                fileTransfer.onProgress(function (event) {
                    var progress = Math.floor(event.loaded / event.total * 100); //下载进度
                    _this.updateProgress = progress;
                    if (!backgroundProcess) {
                        if (progress === 100) {
                            alert && alert.dismiss();
                        }
                        else {
                            if (!timer) {
                                timer = setTimeout(function () {
                                    clearTimeout(timer);
                                    timer = null;
                                    var title = document.getElementsByClassName('alert-title')[0];
                                    title && (title.innerHTML = "\u4E0B\u8F7D\u8FDB\u5EA6\uFF1A" + progress + "%");
                                }, 1000);
                            }
                        }
                    }
                });
            });
        }
    };
    /**
     * 检查是否需要更新
     */
    VersionService.prototype.checkNewVersion = function () {
        var _this = this;
        if (this.updateProgress == -1 || this.updateProgress == 100) {
            if (this.currentVersionNo != this.latestVersionNo) {
                this.assertUpgrade();
            }
            else {
                this.nativeService.alert('已经是最新版本');
            }
        }
        else {
            var alert_1 = this.alertCtrl.create({
                title: "\u4E0B\u8F7D\u8FDB\u5EA6\uFF1A" + this.updateProgress + "%",
                buttons: [{ text: '后台下载' }]
            });
            alert_1.present();
            var interval_1 = setInterval(function () {
                alert_1.setTitle("\u4E0B\u8F7D\u8FDB\u5EA6\uFF1A" + _this.updateProgress + "%");
                if (_this.updateProgress == 100) {
                    clearInterval(interval_1);
                    alert_1 && alert_1.dismiss();
                }
            }, 1000);
        }
    };
    /**
     * 查询app更新日志
     */
    VersionService.prototype.getVersionList = function () {
        if (this.isMobile) {
            var url = __WEBPACK_IMPORTED_MODULE_7__Utils__["a" /* Utils */].formatUrl(__WEBPACK_IMPORTED_MODULE_6__Constants__["b" /* APP_VERSION_SERVE_URL */] + "/v1/apply/findVersionList/" + this.appName + "/" + this.appType);
            return this.httpService.get(url).map(function (res) {
                if (res && res.code == 1) {
                    return res.data.versions || [];
                }
            });
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of([]);
        }
    };
    return VersionService;
}());
VersionService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_9__NativeService__["a" /* NativeService */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_file_transfer__["a" /* FileTransfer */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__["a" /* File */],
        __WEBPACK_IMPORTED_MODULE_8__HttpService__["a" /* HttpService */],
        __WEBPACK_IMPORTED_MODULE_10__FileService__["a" /* FileService */],
        __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_5__Logger__["a" /* Logger */]])
], VersionService);

//# sourceMappingURL=VersionService.js.map

/***/ }),

/***/ 285:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__chat_chat__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__me_me__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(147);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TabsPage = (function () {
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_1__chat_chat__["a" /* ChatPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_2__me_me__["a" /* MePage */];
    }
    return TabsPage;
}());
TabsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\tabs\tabs.html"*/'<ion-tabs>\n  <ion-tab [root]="tab1Root" tabTitle="医馆" tabIcon="home"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="咨询" tabIcon="chatbubbles"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="我的" tabIcon="contact"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\tabs\tabs.html"*/
    }),
    __metadata("design:paramtypes", [])
], TabsPage);

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 286:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__doctor_list_doctor_list__ = __webpack_require__(66);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ChatPage = (function () {
    function ChatPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ChatPage.prototype.startPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__doctor_list_doctor_list__["a" /* DoctorListPage */]);
    };
    return ChatPage;
}());
ChatPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-chat',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\chat\chat.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      咨询\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content style="background: #eee;">\n  <div class="chat-begin" text-center>\n    <ion-icon name="chatbubbles"></ion-icon>\n    <p>您还没有向医生咨询过</p>\n    <button ion-button (click)="startPage();">开启我的中医之旅</button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\chat\chat.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */]])
], ChatPage);

//# sourceMappingURL=chat.js.map

/***/ }),

/***/ 287:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BuyPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BuyPage = (function () {
    function BuyPage(navCtrl, params, toastCtrl) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.toastCtrl = toastCtrl;
        this.name = this.params.get('name');
        this.price = this.params.get('price');
        this.avatar = this.params.get('avatar');
        console.log(this.params);
    }
    BuyPage.prototype.tel = function () {
        var toast = this.toastCtrl.create({
            message: '拨打客服电话',
            duration: 3000,
            position: 'middle'
        });
        toast.onDidDismiss(function () {
            // console.log('Dismissed toast');
        });
        toast.present();
    };
    BuyPage.prototype.startPayPage = function () {
        var toast = this.toastCtrl.create({
            message: '支付开发中',
            duration: 3000,
            position: 'middle'
        });
        toast.onDidDismiss(function () {
            // console.log('Dismissed toast');
        });
        toast.present();
    };
    return BuyPage;
}());
BuyPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-buy',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\buy\buy.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>购买调理服务</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content style="background: #eee;">\n  <ion-list class="no-border">\n    <ion-item>\n      <ion-avatar item-start>\n        <img [src]="avatar" />\n      </ion-avatar>\n      <h2>{{name}}  <small class="red">图文问诊服务</small></h2>\n      <h2 class="red">￥ {{price}}/次</h2>\n    </ion-item>\n    <ion-item class="buy-menu">\n      <ion-row>\n        <ion-col col-4>\n          <img src="assets/imgs/icon-1.png" />\n          <p>图文</p>\n          <p>对话交流</p>\n        </ion-col>\n        <ion-col col-4>\n          <img src="assets/imgs/icon-2.png" />\n          <p>严谨</p>\n          <p>辩证开方</p>\n        </ion-col>\n        <ion-col col-4>\n          <img src="assets/imgs/icon-3.png" />\n          <p>制定</p>\n          <p>调理建议</p>\n        </ion-col>\n      </ion-row>\n    </ion-item>\n  </ion-list>\n  <ion-list radio-group class="no-border">\n    <ion-item>\n      <ion-label>微信支付</ion-label>\n      <ion-radio checked="true" value="weixin"></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>支付宝支付</ion-label>\n      <ion-radio value="alipay"></ion-radio>\n    </ion-item>\n  </ion-list>\n  <ion-list class="no-border">\n    <ion-item>\n      <br />\n      <h2 text-center> · 温馨提示 · </h2>\n      <br />\n      <p text-wrap>· 医生将在24小时内回复您，逾期未回复您可选择继续等待或申请退款。</p>\n      <p text-wrap>· 医生将与您通过图片、文字进行交流。</p>\n      <p text-wrap>· 医生将依据患者实际情况辩证开方、给出调理建议。</p>\n      <p text-wrap>· 购买成功后请如实填写问诊单并发送给医生，医生将按照接到问诊单先后顺序回复。</p>\n      <p text-wrap>· 问诊过程中请避免向医生咨询非患者本人的问题，否则医生有权提前结束咨询。</p>\n      <p text-wrap>· 本服务有效期：72小时有效。</p>\n      <p text-wrap>· 购买即同意《<span class="red">服务协议</span>》</p>\n      <br />\n    </ion-item>\n  </ion-list>\n</ion-content>\n<ion-footer>\n  <ion-toolbar class="footer">\n    <ion-grid>\n      <ion-row>\n        <ion-col col-2 (click)="tel()">\n          <p>客服</p>\n        </ion-col>\n        <ion-col col-7>\n          <p class="red">实付{{price}}元</p>\n        </ion-col>\n        <ion-col col-3>\n          <p class="red-bg" (click)="startPayPage()">去支付</p>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-toolbar>\n</ion-footer>'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\buy\buy.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ToastController */]])
], BuyPage);

//# sourceMappingURL=buy.js.map

/***/ }),

/***/ 288:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__chat_list_chat_list__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__order_list_order_list__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__buy_list_buy_list__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__collect_collect__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__settings_settings__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__me_settings_me_settings__ = __webpack_require__(294);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var MePage = (function () {
    function MePage(navCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
    }
    MePage.prototype.startMeSettingsPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__me_settings_me_settings__["a" /* MeSettingsPage */]);
    };
    MePage.prototype.startChatListPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__chat_list_chat_list__["a" /* ChatListPage */]);
    };
    MePage.prototype.startPlanPage = function () {
        var toast = this.toastCtrl.create({
            message: '尚未开放',
            duration: 3000,
            position: 'middle'
        });
        toast.onDidDismiss(function () {
            // console.log('Dismissed toast');
        });
        toast.present();
    };
    MePage.prototype.startCollectPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__collect_collect__["a" /* CollectPage */]);
    };
    MePage.prototype.startOrderListPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__order_list_order_list__["a" /* OrderListPage */]);
    };
    MePage.prototype.startBuyListPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__buy_list_buy_list__["a" /* BuyListPage */]);
    };
    MePage.prototype.startSettingsPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__settings_settings__["a" /* SettingsPage */]);
    };
    return MePage;
}());
MePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-me',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\me\me.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      我的\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content style="background: #eee;">\n  <ion-list>\n    <button ion-item (click)="startMeSettingsPage()">\n      <ion-avatar item-start>\n        <img src="assets/imgs/avatar-3.png">\n      </ion-avatar>\n      <h2>林更新</h2>\n      <p>32岁 ♂</p>\n    </button>\n  </ion-list>\n  <ion-grid class="me-menu" text-center>\n    <ion-row>\n      <ion-col col-3 (click)="startChatListPage()">\n        <img src="assets/imgs/icon-9.png" />\n        <p>问诊单</p>\n      </ion-col>\n      <ion-col col-3 (click)="startPlanPage()">\n        <img src="assets/imgs/icon-10.png" />\n        <p>方案</p>\n      </ion-col>\n      <ion-col col-3 (click)="startCollectPage()">\n        <img src="assets/imgs/icon-11.png" />\n        <p>收藏</p>\n      </ion-col>\n      <ion-col col-3 (click)="startOrderListPage()">\n        <img src="assets/imgs/icon-12.png" />\n        <p>订单</p>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n  <div class="space"></div>\n  <ion-list class="no-border">\n    <button ion-item (click)="startPlanPage()">\n      <ion-icon name="logo-instagram" item-start></ion-icon>\n      识方问药\n    </button>\n    <button ion-item (click)="startBuyListPage()">\n      <ion-icon name="paper" item-start></ion-icon>\n      消费记录\n    </button>\n  </ion-list>\n  <ion-list class="no-border">\n    <button ion-item (click)="startSettingsPage()">\n      <ion-icon name="settings" item-start></ion-icon>\n      设置\n    </button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\me\me.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ToastController */]])
], MePage);

//# sourceMappingURL=me.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__doctor_list_doctor_list__ = __webpack_require__(66);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ChatListPage = (function () {
    function ChatListPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ChatListPage.prototype.startPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__doctor_list_doctor_list__["a" /* DoctorListPage */]);
    };
    return ChatListPage;
}());
ChatListPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-chat-list',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\chat-list\chat-list.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      问诊单\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content style="background: #eee;">\n  <div class="chat-begin" text-center>\n    <ion-icon name="chatbubbles"></ion-icon>\n    <p>您还没有向医生咨询过</p>\n    <button ion-button (click)="startPage();">开启我的中医之旅</button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\chat-list\chat-list.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */]])
], ChatListPage);

//# sourceMappingURL=chat-list.js.map

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var OrderListPage = (function () {
    function OrderListPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    return OrderListPage;
}());
OrderListPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-order-list',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\order-list\order-list.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      购药订单\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content style="background: #eee;">\n  <div class="order-begin" text-center>\n    <p>您还没有购药订单</p>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\order-list\order-list.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */]])
], OrderListPage);

//# sourceMappingURL=order-list.js.map

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BuyListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var BuyListPage = (function () {
    function BuyListPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    return BuyListPage;
}());
BuyListPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-buy-list',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\buy-list\buy-list.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      消费记录\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content style="background: #eee;">\n  <div class="order-begin" text-center>\n    <p>您还没有消费记录</p>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\buy-list\buy-list.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */]])
], BuyListPage);

//# sourceMappingURL=buy-list.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CollectPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CollectPage = (function () {
    function CollectPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.status = 1;
    }
    CollectPage.prototype.collectTab = function (i) {
        console.log(i);
    };
    return CollectPage;
}());
CollectPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-collect',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\collect\collect.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      我的收藏\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content style="background: #fff;">\n  <ion-list radio-group class="collect-radio" [(ngModel)]="status">\n    <ion-item>\n      <ion-label>药膳</ion-label>\n      <ion-radio value="1" checked></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>药方</ion-label>\n      <ion-radio value="2"></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>药材</ion-label>\n      <ion-radio value="3"></ion-radio>\n    </ion-item>\n  </ion-list>\n  <div *ngIf="status==1">\n    <ion-item class="no-border">\n      <img src="../assets/imgs/empty-1.png" />\n      <p text-center>您还没有收藏药膳</p>\n    </ion-item>\n  </div>\n  <div *ngIf="status==2">\n    <ion-item class="no-border">\n      <img src="../assets/imgs/empty-1.png" />\n      <p text-center>您还没有收藏药方</p>\n    </ion-item>\n  </div>\n  <div *ngIf="status==3">\n    <ion-item class="no-border">\n      <img src="../assets/imgs/empty-1.png" />\n      <p text-center>您还没有收藏药材</p>\n    </ion-item>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\collect\collect.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */]])
], CollectPage);

//# sourceMappingURL=collect.js.map

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SettingsPage = (function () {
    function SettingsPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    return SettingsPage;
}());
SettingsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-settings',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\settings\settings.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      设置\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content style="background: #eee;">\n  <ion-list>\n    <button ion-item>修改密码</button>\n  </ion-list>\n  <ion-list>\n    <button ion-item>退出</button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\settings\settings.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */]])
], SettingsPage);

//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MeSettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MeSettingsPage = (function () {
    function MeSettingsPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    return MeSettingsPage;
}());
MeSettingsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-me-settings',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\me-settings\me-settings.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      个人信息\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content style="background: #eee;">\n  <ion-list>\n    <button ion-item>头像</button>\n    <button ion-item>昵称</button>\n    <button ion-item>性别</button>\n    <button ion-item>出生年份</button>\n  </ion-list>\n  <ion-list>\n    <button ion-item>过敏史</button>\n    <button ion-item>既往病史</button>\n    <button ion-item>生活习惯</button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\me-settings\me-settings.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */]])
], MeSettingsPage);

//# sourceMappingURL=me-settings.js.map

/***/ }),

/***/ 295:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DiseaseDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__doctor_doctor__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_CommonService__ = __webpack_require__(37);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DiseaseDetailPage = (function () {
    function DiseaseDetailPage(navCtrl, commonService) {
        this.navCtrl = navCtrl;
        this.commonService = commonService;
    }
    DiseaseDetailPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.commonService.getDoctorList().subscribe(function (resp) {
            resp.data.map(function (o) {
                o.adeptArr = o.adept ? o.adept.split(',') : [];
                o.rank = o.rank.toString().replace('0', '').replace('1', '主任医师').replace('2', '副主任医师').replace('3', '主治医师').replace('4', '住院医师').replace('5', '医师');
                o.price = parseFloat(o.price);
            });
            _this.doctorList = resp.data;
        });
    };
    DiseaseDetailPage.prototype.startDoctorPage = function (id) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__doctor_doctor__["a" /* DoctorPage */], { id: id });
    };
    return DiseaseDetailPage;
}());
DiseaseDetailPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-disease-detail',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\disease-detail\disease-detail.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>中医课堂</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content style="background: #eee;">\n  <ion-list>\n    <ion-item class="disease-detail">\n      <h2>常见病因</h2>\n      <p text-wrap>脾胃虚弱：因情志不畅、饮食不节而发脾胃虚弱。胃腐熟失职，饥不欲食，食而不化；脾气失司，水液不行则便溏；脾气无力，则见便秘；脾不升清，故见神疲；四肢不养，则见乏力。</p>\n    </ion-item>\n  </ion-list>\n  <ion-list class="doctor-list">\n    <ion-item text-center class="adept">以下医生擅长治疗「脾胃虚弱」</ion-item>\n        <button ion-item class="home-doctor-info" (click)="startDoctorPage(item.id)" *ngFor="let item of doctorList">\n      <ion-thumbnail item-start>\n        <img [src]="item.avatar">\n      </ion-thumbnail>\n      <h2>{{item.name}}</h2>\n      <p><small>{{item.hospital}} {{item.rank}}</small></p>\n      <p><span *ngFor="let child of adeptArr">{{child}}</span></p>\n      <p><em>￥{{item.price}}元/次</em> <!-- 1441人付款，190条评价 --></p>\n    </button>\n    <!-- \n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-1.png">\n      </ion-thumbnail>\n      <h2>王医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-2.png">\n      </ion-thumbnail>\n      <h2>李医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-1.png">\n      </ion-thumbnail>\n      <h2>张医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-2.png">\n      </ion-thumbnail>\n      <h2>莉医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-1.png">\n      </ion-thumbnail>\n      <h2>黄医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button> -->\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\disease-detail\disease-detail.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__service_CommonService__["a" /* CommonService */]])
], DiseaseDetailPage);

//# sourceMappingURL=disease-detail.js.map

/***/ }),

/***/ 296:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DepartmentPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__doctor_list_doctor_list__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_CommonService__ = __webpack_require__(37);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DepartmentPage = (function () {
    function DepartmentPage(navCtrl, commonService) {
        this.navCtrl = navCtrl;
        this.commonService = commonService;
    }
    DepartmentPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.commonService.getDepartmentList().subscribe(function (resp) {
            _this.departmentList = resp.data;
        });
    };
    DepartmentPage.prototype.startDoctorPage = function (name) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__doctor_list_doctor_list__["a" /* DoctorListPage */], { name: name });
    };
    return DepartmentPage;
}());
DepartmentPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-department',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\department\department.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      科室列表\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <button ion-item (click)="startDoctorPage(item.name)" *ngFor="let item of departmentList">{{item.name}}</button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\department\department.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__service_CommonService__["a" /* CommonService */]])
], DepartmentPage);

//# sourceMappingURL=department.js.map

/***/ }),

/***/ 297:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reg_reg__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_CommonService__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_Helper__ = __webpack_require__(145);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LoginPage = (function () {
    function LoginPage(navCtrl, viewCtrl, globalData, storage, formBuilder, helper, commonService) {
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.globalData = globalData;
        this.storage = storage;
        this.formBuilder = formBuilder;
        this.helper = helper;
        this.commonService = commonService;
        this.submitted = false;
        this.loginForm = this.formBuilder.group({
            phone: [this.globalData.phone || '', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(2)]],
            password: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(4)]]
        });
    }
    LoginPage.prototype.startRegPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__reg_reg__["a" /* RegPage */]);
    };
    LoginPage.prototype.login = function (user) {
        var _this = this;
        this.submitted = true;
        this.commonService.patientLogin({ phone: user.phone, password: user.password }).subscribe(function (resp) {
            _this.globalData.token = resp.token;
            _this.storage.set('token', resp.token);
            _this.submitted = false;
            _this.helper.loginSuccessHandle(resp.userInfo);
            _this.viewCtrl.dismiss();
        }, function () {
            _this.submitted = false;
        });
    };
    return LoginPage;
}());
LoginPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-login',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\login\login.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      登录\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <form [formGroup]="loginForm" (ngSubmit)="login(loginForm.value)">\n    <ion-list>\n      <ion-item>\n        <ion-input type="text" formControlName="phone" placeholder="手机号"></ion-input>\n      </ion-item>\n      <ion-item>\n        <ion-input type="password" formControlName="password" placeholder="6位以上密码"></ion-input>\n        <!-- <button ion-button item-end clear color="dark">忘记密码?</button> -->\n      </ion-item>\n    </ion-list>\n    <div padding-horizontal>\n      <button ion-button color="primary" block type="submit" [disabled]="!loginForm.valid||submitted">登录</button>\n      <button ion-button clear color="primary" block (click)="startRegPage()">我要注册</button>\n    </div>\n  </form>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\login\login.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_GlobalData__["a" /* GlobalData */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_7__providers_Helper__["a" /* Helper */],
        __WEBPACK_IMPORTED_MODULE_6__service_CommonService__["a" /* CommonService */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 298:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__service_CommonService__ = __webpack_require__(37);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



// import { Http, Response } from '@angular/http'
// import { AppConfig } from './../../app/app.config'

var RegPage = (function () {
    function RegPage(navCtrl, toastCtrl, commonService) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.commonService = commonService;
        this.phone = '';
        this.password = '';
        this.confirmPassword = '';
    }
    RegPage.prototype.submitReg = function () {
        var _this = this;
        if (this.phone.trim() === '') {
            var toast = this.toastCtrl.create({
                message: '手机号不能为空',
                duration: 1200
            });
            toast.present();
        }
        else if (!(/^1[34578]\d{9}$/.test(this.phone))) {
            var toast = this.toastCtrl.create({
                message: '手机号格式不正确',
                duration: 1200
            });
            toast.present();
        }
        else if (this.password.trim() === '') {
            var toast = this.toastCtrl.create({
                message: '密码不能为空',
                duration: 1200
            });
            toast.present();
        }
        else if (this.password.trim().length < 6) {
            var toast = this.toastCtrl.create({
                message: '密码不能长度不能小于6位',
                duration: 1200
            });
            toast.present();
        }
        else if (this.confirmPassword !== this.password) {
            var toast = this.toastCtrl.create({
                message: '两次密码输入不一致',
                duration: 1200
            });
            toast.present();
        }
        else {
            this.commonService.patientRegister({
                phone: this.phone,
                password: this.password
            }).subscribe(function (res) {
                var toast = _this.toastCtrl.create({
                    message: '注册成功！',
                    duration: 1200
                });
                toast.present();
                _this.navCtrl.pop();
            });
        }
    };
    return RegPage;
}());
RegPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-reg',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\reg\reg.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      注册\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <ion-list>\n    <ion-item>\n      <ion-input type="text" [(ngModel)]="phone" placeholder="手机号"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-input type="password" [(ngModel)]="password" placeholder="6位以上密码"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-input type="password" [(ngModel)]="confirmPassword" placeholder="再次确认密码"></ion-input>\n    </ion-item>\n  </ion-list>\n  <div padding-horizontal>\n    <button ion-button color="primary" block (click)="submitReg()">提交</button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\reg\reg.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__service_CommonService__["a" /* CommonService */]])
], RegPage);

//# sourceMappingURL=reg.js.map

/***/ }),

/***/ 36:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Created by yanxiaojun on 2017/4/13.
 */

var GlobalData = (function () {
    function GlobalData() {
        //设置http请求是否显示loading,注意:设置为true,接下来的请求会不显示loading,请求执行完成会自动设置为false
        this._showLoading = true;
        //是否启用文件缓存
        this._enabledFileCache = true;
    }
    Object.defineProperty(GlobalData.prototype, "userId", {
        get: function () {
            return this._userId;
        },
        set: function (value) {
            this._userId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalData.prototype, "phone", {
        get: function () {
            return this._phone;
        },
        set: function (value) {
            this._phone = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalData.prototype, "user", {
        get: function () {
            return this._user;
        },
        set: function (value) {
            this._user = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalData.prototype, "token", {
        get: function () {
            return this._token;
        },
        set: function (value) {
            this._token = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalData.prototype, "showLoading", {
        get: function () {
            return this._showLoading;
        },
        set: function (value) {
            this._showLoading = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GlobalData.prototype, "enabledFileCache", {
        get: function () {
            return this._enabledFileCache;
        },
        set: function (value) {
            this._enabledFileCache = value;
        },
        enumerable: true,
        configurable: true
    });
    return GlobalData;
}());
GlobalData = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])()
], GlobalData);

//# sourceMappingURL=GlobalData.js.map

/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommonService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_HttpService__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_Utils__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_NativeService__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_Constants__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_Logger__ = __webpack_require__(52);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by yanxiaojun on 2017/2/16.
 */







/**
 *
 */
var CommonService = (function () {
    function CommonService(httpService, nativeService, logger) {
        this.httpService = httpService;
        this.nativeService = nativeService;
        this.logger = logger;
    }
    /**
     * 登录获取token
     */
    CommonService.prototype.getToken = function (username, password) {
        return this.httpService.post('/v1/login', {
            'client_id': 'app',
            'username': username,
            'password': __WEBPACK_IMPORTED_MODULE_3__providers_Utils__["a" /* Utils */].hex_md5(password)
        });
    };
    /**
     * 查询用户信息
     */
    CommonService.prototype.getUserInfo = function () {
        return this.httpService.get('/v1/public/user/self');
    };
    /**
     * 获取新token
     */
    CommonService.prototype.getNewToken = function () {
        return this.httpService.post('/v1/refresh_token');
    };
    /**
     * 查询登录用户所拥有的资源
     * resourceType: 资源类型1:菜单,2:url,3:按钮
     */
    CommonService.prototype.getResource = function (resourceType) {
        if (resourceType === void 0) { resourceType = 1; }
        var url = '/v1/public/resource';
        var json = __WEBPACK_IMPORTED_MODULE_3__providers_Utils__["a" /* Utils */].sessionStorageGetItem(url);
        if (json) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(json.filter(function (item) {
                return item.resourceType == resourceType;
            }));
        }
        return this.httpService.post(url, { clientType: 2 }).map(function (res) {
            __WEBPACK_IMPORTED_MODULE_3__providers_Utils__["a" /* Utils */].sessionStorageSetItem(url, res);
            return res.filter(function (item) {
                return item.resourceType == resourceType;
            });
        });
    };
    /**
     * 更新文件缓存文件关系
     */
    CommonService.prototype.fileRelationReplace = function (data) {
        return this.httpService.post('/fileRelation/replace', data).map(function (res) { return res.json(); });
    };
    /**
     * 从版本管理服务中查询app版本信息
     */
    CommonService.prototype.getAppVersion = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].create(function (observer) {
            _this.nativeService.getPackageName().subscribe(function (packageName) {
                var appName = packageName.substring(packageName.lastIndexOf('.') + 1);
                var appType = _this.nativeService.isAndroid() ? 'android' : 'ios';
                var url = __WEBPACK_IMPORTED_MODULE_3__providers_Utils__["a" /* Utils */].formatUrl(__WEBPACK_IMPORTED_MODULE_5__providers_Constants__["b" /* APP_VERSION_SERVE_URL */] + "/v1/apply/getDownloadPageByEName/" + appName + "/" + appType);
                _this.httpService.get(url).subscribe(function (res) {
                    if (res && res.code == 1) {
                        observer.next(res.data); //返回app最新版本信息
                    }
                }, function (err) {
                    _this.logger.log(err, '从版本升级服务获取版本信息失败', {
                        url: url
                    });
                    observer.error(false);
                });
            }, function (err) {
                _this.logger.log(err, '获取包名失败');
                observer.error(false);
            });
        });
    };
    /**
     * 查询公告列表
     */
    CommonService.prototype.findPublishList = function () {
        return this.httpService.post('/sys/notice/findPublishList').map(function (res) { return res.json(); });
    };
    /**
     * 查询公告详情
     */
    CommonService.prototype.getPublishDetail = function (id) {
        return this.httpService.get("/sys/notice/getById/" + id).map(function (res) { return res.json(); });
    };
    CommonService.prototype.patientRegister = function (data) {
        return this.httpService.post('patientRegister', data);
    };
    CommonService.prototype.patientLogin = function (data) {
        return this.httpService.post('patientLogin', data);
    };
    CommonService.prototype.patientReloadToken = function () {
        return this.httpService.post('patientReloadToken');
    };
    CommonService.prototype.getSicknessList = function () {
        return this.httpService.post('listSickness');
    };
    CommonService.prototype.getDoctorList = function () {
        return this.httpService.post('listDoctor');
    };
    CommonService.prototype.getDepartmentList = function () {
        return this.httpService.post('listDepartment');
    };
    CommonService.prototype.getDoctorById = function (id) {
        return this.httpService.post('getDoctorById', { id: id });
    };
    return CommonService;
}());
CommonService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_HttpService__["a" /* HttpService */], __WEBPACK_IMPORTED_MODULE_4__providers_NativeService__["a" /* NativeService */], __WEBPACK_IMPORTED_MODULE_6__providers_Logger__["a" /* Logger */]])
], CommonService);

//# sourceMappingURL=CommonService.js.map

/***/ }),

/***/ 422:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(423);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(427);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 427:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export FunDebugErrorHandler */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_chat_chat__ = __webpack_require__(286);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_me_me__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_home_home__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_doctor_doctor__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_buy_buy__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_chat_list_chat_list__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_order_list_order_list__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_buy_list_buy_list__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_collect_collect__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_doctor_list_doctor_list__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_disease_detail_disease_detail__ = __webpack_require__(295);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_me_settings_me_settings__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_settings_settings__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_login_login__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_reg_reg__ = __webpack_require__(298);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_department_department__ = __webpack_require__(296);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__ionic_native_app_version__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ionic_native_camera__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ionic_native_toast__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_file__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_file_transfer__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_in_app_browser__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ionic_native_image_picker__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ionic_native_network__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ionic_native_app_minimize__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__typings_modules_jpush_index__ = __webpack_require__(282);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ionic_native_code_push__ = __webpack_require__(281);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_call_number__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ionic_native_barcode_scanner__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__providers_NativeService__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__providers_HttpService__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__providers_FileService__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__providers_Helper__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__providers_Utils__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__providers_GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__providers_Constants__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__providers_Logger__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__modal_transitions__ = __webpack_require__(741);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__ionic_native_diagnostic__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__service_CommonService__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__providers_VersionService__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48_ion2_calendar__ = __webpack_require__(742);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__ionic_native_status_bar__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__ionic_native_splash_screen__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51_fundebug_javascript__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51_fundebug_javascript___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_51_fundebug_javascript__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




















































//参考文档:https://docs.fundebug.com/notifier/javascript/framework/ionic2.html

__WEBPACK_IMPORTED_MODULE_51_fundebug_javascript__["apikey"] = __WEBPACK_IMPORTED_MODULE_42__providers_Constants__["f" /* FUNDEBUG_API_KEY */];
__WEBPACK_IMPORTED_MODULE_51_fundebug_javascript__["releasestage"] = __WEBPACK_IMPORTED_MODULE_42__providers_Constants__["h" /* IS_DEBUG */] ? 'development' : 'production'; //应用开发阶段，development:开发;production:生产
__WEBPACK_IMPORTED_MODULE_51_fundebug_javascript__["silent"] = !__WEBPACK_IMPORTED_MODULE_42__providers_Constants__["h" /* IS_DEBUG */]; //如果暂时不需要使用Fundebug，将silent属性设为true
var FunDebugErrorHandler = (function () {
    function FunDebugErrorHandler() {
    }
    FunDebugErrorHandler.prototype.handleError = function (err) {
        __WEBPACK_IMPORTED_MODULE_51_fundebug_javascript__["notifyError"](err);
        console.error(err);
    };
    return FunDebugErrorHandler;
}());

var AppModule = (function () {
    function AppModule(config) {
        this.config = config;
        this.setCustomTransitions();
    }
    AppModule.prototype.setCustomTransitions = function () {
        this.config.setTransition('modal-from-right-enter', __WEBPACK_IMPORTED_MODULE_44__modal_transitions__["a" /* ModalFromRightEnter */]);
        this.config.setTransition('modal-from-right-leave', __WEBPACK_IMPORTED_MODULE_44__modal_transitions__["b" /* ModalFromRightLeave */]);
        this.config.setTransition('modal-scale-enter', __WEBPACK_IMPORTED_MODULE_44__modal_transitions__["c" /* ModalScaleEnter */]);
        this.config.setTransition('modal-scale-leave', __WEBPACK_IMPORTED_MODULE_44__modal_transitions__["d" /* ModalScaleLeave */]);
    };
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_7__pages_me_me__["a" /* MePage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_chat_chat__["a" /* ChatPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["b" /* MoreModal */],
            __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_doctor_doctor__["a" /* DoctorPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_buy_buy__["a" /* BuyPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_chat_list_chat_list__["a" /* ChatListPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_order_list_order_list__["a" /* OrderListPage */],
            __WEBPACK_IMPORTED_MODULE_14__pages_buy_list_buy_list__["a" /* BuyListPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_collect_collect__["a" /* CollectPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_disease_detail_disease_detail__["a" /* DiseaseDetailPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_doctor_list_doctor_list__["a" /* DoctorListPage */],
            __WEBPACK_IMPORTED_MODULE_18__pages_me_settings_me_settings__["a" /* MeSettingsPage */],
            __WEBPACK_IMPORTED_MODULE_19__pages_settings_settings__["a" /* SettingsPage */],
            __WEBPACK_IMPORTED_MODULE_20__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_21__pages_reg_reg__["a" /* RegPage */],
            __WEBPACK_IMPORTED_MODULE_22__pages_department_department__["a" /* DepartmentPage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */], {
                tabsHideOnSubPages: 'true',
                backButtonText: '返回',
                iconMode: 'ios',
                mode: 'ios',
                modalEnter: 'modal-slide-in',
                modalLeave: 'modal-slide-out',
            }, {
                links: []
            }),
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["a" /* IonicStorageModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_48_ion2_calendar__["a" /* CalendarModule */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_7__pages_me_me__["a" /* MePage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_chat_chat__["a" /* ChatPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["b" /* MoreModal */],
            __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_doctor_doctor__["a" /* DoctorPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_buy_buy__["a" /* BuyPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_chat_list_chat_list__["a" /* ChatListPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_order_list_order_list__["a" /* OrderListPage */],
            __WEBPACK_IMPORTED_MODULE_14__pages_buy_list_buy_list__["a" /* BuyListPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_collect_collect__["a" /* CollectPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_disease_detail_disease_detail__["a" /* DiseaseDetailPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_doctor_list_doctor_list__["a" /* DoctorListPage */],
            __WEBPACK_IMPORTED_MODULE_18__pages_me_settings_me_settings__["a" /* MeSettingsPage */],
            __WEBPACK_IMPORTED_MODULE_19__pages_settings_settings__["a" /* SettingsPage */],
            __WEBPACK_IMPORTED_MODULE_20__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_21__pages_reg_reg__["a" /* RegPage */],
            __WEBPACK_IMPORTED_MODULE_22__pages_department_department__["a" /* DepartmentPage */]
        ],
        providers: [
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["H" /* LOCALE_ID */], useValue: "zh-CN" },
            __WEBPACK_IMPORTED_MODULE_49__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_50__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_23__ionic_native_app_version__["a" /* AppVersion */],
            __WEBPACK_IMPORTED_MODULE_24__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_25__ionic_native_toast__["a" /* Toast */],
            __WEBPACK_IMPORTED_MODULE_26__ionic_native_file__["a" /* File */],
            __WEBPACK_IMPORTED_MODULE_27__ionic_native_file_transfer__["a" /* FileTransfer */],
            __WEBPACK_IMPORTED_MODULE_28__ionic_native_in_app_browser__["a" /* InAppBrowser */],
            __WEBPACK_IMPORTED_MODULE_29__ionic_native_image_picker__["a" /* ImagePicker */],
            __WEBPACK_IMPORTED_MODULE_30__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_31__ionic_native_app_minimize__["a" /* AppMinimize */],
            __WEBPACK_IMPORTED_MODULE_45__ionic_native_diagnostic__["a" /* Diagnostic */],
            __WEBPACK_IMPORTED_MODULE_32__typings_modules_jpush_index__["a" /* JPush */],
            __WEBPACK_IMPORTED_MODULE_33__ionic_native_code_push__["a" /* CodePush */],
            __WEBPACK_IMPORTED_MODULE_34__ionic_native_call_number__["a" /* CallNumber */],
            __WEBPACK_IMPORTED_MODULE_35__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ErrorHandler */], useClass: FunDebugErrorHandler },
            __WEBPACK_IMPORTED_MODULE_36__providers_NativeService__["a" /* NativeService */],
            __WEBPACK_IMPORTED_MODULE_37__providers_HttpService__["a" /* HttpService */],
            __WEBPACK_IMPORTED_MODULE_38__providers_FileService__["a" /* FileService */],
            __WEBPACK_IMPORTED_MODULE_39__providers_Helper__["a" /* Helper */],
            __WEBPACK_IMPORTED_MODULE_40__providers_Utils__["a" /* Utils */],
            __WEBPACK_IMPORTED_MODULE_41__providers_GlobalData__["a" /* GlobalData */],
            __WEBPACK_IMPORTED_MODULE_43__providers_Logger__["a" /* Logger */],
            __WEBPACK_IMPORTED_MODULE_46__service_CommonService__["a" /* CommonService */],
            __WEBPACK_IMPORTED_MODULE_47__providers_VersionService__["a" /* VersionService */]
        ]
    })
    // export class AppModule {}
    ,
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["c" /* Config */]])
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_NativeService__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_Helper__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_Utils__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_CommonService__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_VersionService__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__ = __webpack_require__(285);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_login_login__ = __webpack_require__(297);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var MyApp = (function () {
    function MyApp(platform, keyboard, ionicApp, storage, globalData, helper, toastCtrl, modalCtrl, events, commonService, versionService, nativeService) {
        var _this = this;
        this.platform = platform;
        this.keyboard = keyboard;
        this.ionicApp = ionicApp;
        this.storage = storage;
        this.globalData = globalData;
        this.helper = helper;
        this.toastCtrl = toastCtrl;
        this.modalCtrl = modalCtrl;
        this.events = events;
        this.commonService = commonService;
        this.versionService = versionService;
        this.nativeService = nativeService;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_9__pages_tabs_tabs__["a" /* TabsPage */];
        this.backButtonPressed = false;
        platform.ready().then(function () {
            _this.nativeService.statusBarStyle();
            _this.nativeService.splashScreenHide();
            _this.assertNetwork(); //检测网络
            _this.helper.funDebugInit(); //初始化fundebug
            _this.helper.alloyLeverInit(); //本地"开发者工具"
            _this.helper.initJpush(); //初始化极光推送
            _this.storage.get('token').then(function (token) {
                if (token) {
                    _this.globalData.token = token;
                    _this.commonService.patientReloadToken().subscribe(function (resp) {
                        _this.globalData.token = resp.token;
                        _this.storage.set('token', resp.token);
                        _this.helper.loginSuccessHandle(resp.userInfo);
                    }, function (err) {
                        // this.nativeService.alertObj.dismiss();
                        _this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_10__pages_login_login__["a" /* LoginPage */]).present();
                    });
                }
                else {
                    _this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_10__pages_login_login__["a" /* LoginPage */]).present();
                }
            });
            _this.registerBackButtonAction(); //注册android返回按键事件
            _this.versionService.init(); //初始化版本信息
            setTimeout(function () {
                _this.versionService.assertUpgrade(); //检测app是否升级
                _this.nativeService.sync(); //启动app检查热更新
                __WEBPACK_IMPORTED_MODULE_6__providers_Utils__["a" /* Utils */].sessionStorageClear(); //清除数据缓存
            }, 5000);
        });
    }
    MyApp.prototype.assertNetwork = function () {
        if (!this.nativeService.isConnecting()) {
            this.toastCtrl.create({
                message: '未检测到网络,请连接网络',
                showCloseButton: true,
                closeButtonText: '确定'
            }).present();
        }
    };
    MyApp.prototype.registerBackButtonAction = function () {
        var _this = this;
        if (!this.nativeService.isAndroid()) {
            return;
        }
        this.platform.registerBackButtonAction(function () {
            _this.events.publish('android:backButtonAction');
            if (_this.keyboard.isOpen()) {
                _this.keyboard.close();
                return;
            }
            //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
            // this.ionicApp._toastPortal.getActive() ||this.ionicApp._loadingPortal.getActive()|| this.ionicApp._overlayPortal.getActive()
            var activePortal = _this.ionicApp._modalPortal.getActive() || _this.ionicApp._toastPortal.getActive() || _this.ionicApp._overlayPortal.getActive();
            if (activePortal) {
                activePortal.dismiss();
                return;
            }
            var activeVC = _this.nav.getActive();
            var tabs = activeVC.instance.tabs;
            var activeNav = tabs.getSelected();
            return activeNav.canGoBack() ? activeNav.pop() : _this.nativeService.minimize(); //this.showExit()
        }, 1);
    };
    //双击退出提示框
    MyApp.prototype.showExit = function () {
        var _this = this;
        if (this.backButtonPressed) {
            this.platform.exitApp();
        }
        else {
            this.nativeService.showToast('再按一次退出应用');
            this.backButtonPressed = true;
            setTimeout(function () {
                _this.backButtonPressed = false;
            }, 2000);
        }
    };
    return MyApp;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('myNav'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* Nav */])
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\app\app.html"*/'<ion-nav #myNav [root]="rootPage" swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\app\app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* Keyboard */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicApp */],
        __WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
        __WEBPACK_IMPORTED_MODULE_5__providers_GlobalData__["a" /* GlobalData */],
        __WEBPACK_IMPORTED_MODULE_4__providers_Helper__["a" /* Helper */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["p" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* ModalController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* Events */],
        __WEBPACK_IMPORTED_MODULE_7__service_CommonService__["a" /* CommonService */],
        __WEBPACK_IMPORTED_MODULE_8__providers_VersionService__["a" /* VersionService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_NativeService__["a" /* NativeService */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NativeService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_app_version__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_toast__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_image_picker__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_network__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_app_minimize__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_call_number__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_barcode_scanner__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__Constants__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__Logger__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_diagnostic__ = __webpack_require__(280);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_code_push__ = __webpack_require__(281);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by yanxiaojun617@163.com on 12-27.
 */




















var NativeService = (function () {
    function NativeService(platform, toastCtrl, alertCtrl, statusBar, splashScreen, appVersion, camera, toast, file, inAppBrowser, imagePicker, network, appMinimize, cn, barcodeScanner, loadingCtrl, globalData, logger, diagnostic, codePush) {
        var _this = this;
        this.platform = platform;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.appVersion = appVersion;
        this.camera = camera;
        this.toast = toast;
        this.file = file;
        this.inAppBrowser = inAppBrowser;
        this.imagePicker = imagePicker;
        this.network = network;
        this.appMinimize = appMinimize;
        this.cn = cn;
        this.barcodeScanner = barcodeScanner;
        this.loadingCtrl = loadingCtrl;
        this.globalData = globalData;
        this.logger = logger;
        this.diagnostic = diagnostic;
        this.codePush = codePush;
        this.loadingIsOpen = false;
        /**
         * 一个确定按钮的alert弹出框.
         * @type {(title: string, subTitle?: string, message?: string) => void}
         */
        this.alert = (function () {
            var isExist = false;
            return function (title, subTitle, message) {
                if (subTitle === void 0) { subTitle = ''; }
                if (message === void 0) { message = ''; }
                if (!isExist) {
                    isExist = true;
                    _this.alertObj = _this.alertCtrl.create({
                        title: title,
                        subTitle: subTitle,
                        message: message,
                        buttons: [{
                                text: '确定', handler: function () {
                                    isExist = false;
                                }
                            }],
                        enableBackdropDismiss: false
                    }).present();
                }
            };
        })();
        //检测app位置服务是否开启
        this.assertLocationService = (function () {
            var enabledLocationService = false; //手机是否开启位置服务
            return function () {
                return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
                    if (enabledLocationService) {
                        observer.next(true);
                    }
                    else {
                        _this.diagnostic.isLocationEnabled().then(function (enabled) {
                            if (enabled) {
                                enabledLocationService = true;
                                observer.next(true);
                            }
                            else {
                                enabledLocationService = false;
                                _this.alertCtrl.create({
                                    title: '您未开启位置服务',
                                    subTitle: '正在获取位置信息',
                                    buttons: [{ text: '取消' },
                                        {
                                            text: '去开启',
                                            handler: function () {
                                                _this.diagnostic.switchToLocationSettings();
                                            }
                                        }
                                    ]
                                }).present();
                                observer.error(false);
                            }
                        }).catch(function (err) {
                            _this.logger.log(err, '调用diagnostic.isLocationEnabled方法失败');
                            observer.error(false);
                        });
                    }
                });
            };
        })();
        //检测app是否有定位权限
        this.assertLocationAuthorization = (function () {
            var locationAuthorization = false;
            return function () {
                return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
                    if (locationAuthorization) {
                        observer.next(true);
                    }
                    else {
                        _this.diagnostic.isLocationAuthorized().then(function (res) {
                            if (res) {
                                locationAuthorization = true;
                                observer.next(true);
                            }
                            else {
                                locationAuthorization = false;
                                _this.diagnostic.requestLocationAuthorization('always').then(function (res) {
                                    if (res == 'DENIED_ALWAYS') {
                                        locationAuthorization = false;
                                        _this.alertCtrl.create({
                                            title: '缺少定位权限',
                                            subTitle: '请在手机设置或app权限管理中开启',
                                            buttons: [{ text: '取消' },
                                                {
                                                    text: '去开启',
                                                    handler: function () {
                                                        _this.diagnostic.switchToSettings();
                                                    }
                                                }
                                            ]
                                        }).present();
                                        observer.error(false);
                                    }
                                    else {
                                        locationAuthorization = true;
                                        observer.next(true);
                                    }
                                }).catch(function (err) {
                                    _this.logger.log(err, '调用diagnostic.requestLocationAuthorization方法失败');
                                    observer.error(false);
                                });
                            }
                        }).catch(function (err) {
                            _this.logger.log(err, '调用diagnostic.isLocationAvailable方法失败');
                            observer.error(false);
                        });
                    }
                });
            };
        })();
        //检测app是否有读取存储权限
        this.externalStoragePermissionsAuthorization = (function () {
            var havePermission = false;
            return function () {
                return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
                    if (havePermission) {
                        observer.next(true);
                    }
                    else {
                        var permissions_1 = [_this.diagnostic.permission.READ_EXTERNAL_STORAGE, _this.diagnostic.permission.WRITE_EXTERNAL_STORAGE];
                        _this.diagnostic.getPermissionsAuthorizationStatus(permissions_1).then(function (res) {
                            if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
                                havePermission = true;
                                observer.next(true);
                            }
                            else {
                                havePermission = false;
                                _this.diagnostic.requestRuntimePermissions(permissions_1).then(function (res) {
                                    if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
                                        havePermission = true;
                                        observer.next(true);
                                    }
                                    else {
                                        havePermission = false;
                                        _this.alertCtrl.create({
                                            title: '缺少读取存储权限',
                                            subTitle: '请在手机设置或app权限管理中开启',
                                            buttons: [{ text: '取消' },
                                                {
                                                    text: '去开启',
                                                    handler: function () {
                                                        _this.diagnostic.switchToSettings();
                                                    }
                                                }
                                            ]
                                        }).present();
                                        observer.error(false);
                                    }
                                }).catch(function (err) {
                                    _this.logger.log(err, '调用diagnostic.requestRuntimePermissions方法失败');
                                    observer.error(false);
                                });
                            }
                        }).catch(function (err) {
                            _this.logger.log(err, '调用diagnostic.getPermissionsAuthorizationStatus方法失败');
                            observer.error(false);
                        });
                    }
                });
            };
        })();
    }
    /**
     * 热更新同步方法
     */
    NativeService.prototype.sync = function () {
        if (this.isMobile()) {
            var deploymentKey = '';
            if (this.isAndroid() && __WEBPACK_IMPORTED_MODULE_14__Constants__["h" /* IS_DEBUG */]) {
                deploymentKey = __WEBPACK_IMPORTED_MODULE_14__Constants__["c" /* CODE_PUSH_DEPLOYMENT_KEY */].android.Staging;
            }
            if (this.isAndroid() && !__WEBPACK_IMPORTED_MODULE_14__Constants__["h" /* IS_DEBUG */]) {
                deploymentKey = __WEBPACK_IMPORTED_MODULE_14__Constants__["c" /* CODE_PUSH_DEPLOYMENT_KEY */].android.Production;
            }
            if (this.isIos() && __WEBPACK_IMPORTED_MODULE_14__Constants__["h" /* IS_DEBUG */]) {
                deploymentKey = __WEBPACK_IMPORTED_MODULE_14__Constants__["c" /* CODE_PUSH_DEPLOYMENT_KEY */].ios.Staging;
            }
            if (this.isIos() && !__WEBPACK_IMPORTED_MODULE_14__Constants__["h" /* IS_DEBUG */]) {
                deploymentKey = __WEBPACK_IMPORTED_MODULE_14__Constants__["c" /* CODE_PUSH_DEPLOYMENT_KEY */].ios.Production;
            }
            this.codePush.sync({
                deploymentKey: deploymentKey
            }).subscribe(function (syncStatus) {
                if (syncStatus == 0) {
                    console.log('[CodePush]:app已经是最新版本;syncStatus:' + syncStatus);
                }
                else if (syncStatus == 3) {
                    console.log('[CodePush]:更新出错;syncStatus:' + syncStatus);
                }
                else if (syncStatus == 5) {
                    console.log('[CodePush]:检查是否有更新;syncStatus:' + syncStatus);
                }
                else if (syncStatus == 7) {
                    console.log('[CodePush]:准备下载安装包;syncStatus:' + syncStatus);
                }
                else if (syncStatus == 8) {
                    console.log('[CodePush]:下载完成准备安装;syncStatus:' + syncStatus);
                }
                else {
                    console.log('[CodePush]:syncStatus:' + syncStatus);
                }
            });
        }
    };
    /**
     * 状态栏
     */
    NativeService.prototype.statusBarStyle = function () {
        if (this.isMobile()) {
            this.statusBar.overlaysWebView(false);
            this.statusBar.styleLightContent();
            this.statusBar.backgroundColorByHexString('#488aff'); //3261b3
        }
    };
    /**
     * 隐藏启动页面
     */
    NativeService.prototype.splashScreenHide = function () {
        this.isMobile() && this.splashScreen.hide();
    };
    /**
     * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
     */
    NativeService.prototype.getNetworkType = function () {
        if (!this.isMobile()) {
            return 'wifi';
        }
        return this.network.type;
    };
    /**
     * 判断是否有网络
     */
    NativeService.prototype.isConnecting = function () {
        return this.getNetworkType() != 'none';
    };
    /**
     * 调用最小化app插件
     */
    NativeService.prototype.minimize = function () {
        this.appMinimize.minimize();
    };
    /**
     * 通过浏览器打开url
     */
    NativeService.prototype.openUrlByBrowser = function (url) {
        this.inAppBrowser.create(url, '_system');
    };
    /**
     * 是否真机环境
     */
    NativeService.prototype.isMobile = function () {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    };
    /**
     * 是否android真机环境
     */
    NativeService.prototype.isAndroid = function () {
        return this.isMobile() && this.platform.is('android');
    };
    /**
     * 是否ios真机环境
     */
    NativeService.prototype.isIos = function () {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    };
    /**
     * 统一调用此方法显示提示信息
     * @param message 信息内容
     * @param duration 显示时长
     */
    NativeService.prototype.showToast = function (message, duration) {
        if (message === void 0) { message = '操作完成'; }
        if (duration === void 0) { duration = 2000; }
        if (this.isMobile()) {
            this.toast.show(message, String(duration), 'center').subscribe();
        }
        else {
            this.toastCtrl.create({
                message: message,
                duration: duration,
                position: 'bottom',
                showCloseButton: false
            }).present();
        }
    };
    ;
    /**
     * 统一调用此方法显示loading
     * @param content 显示的内容
     */
    NativeService.prototype.showLoading = function (content) {
        var _this = this;
        if (content === void 0) { content = ''; }
        if (!this.globalData.showLoading) {
            return;
        }
        if (!this.loadingIsOpen) {
            this.loadingIsOpen = true;
            this.loading = this.loadingCtrl.create({
                content: content
            });
            this.loading.present();
            setTimeout(function () {
                _this.dismissLoading();
            }, __WEBPACK_IMPORTED_MODULE_14__Constants__["j" /* REQUEST_TIMEOUT */]);
        }
    };
    ;
    /**
     * 关闭loading
     */
    NativeService.prototype.hideLoading = function () {
        var _this = this;
        if (!this.globalData.showLoading) {
            this.globalData.showLoading = true;
        }
        setTimeout(function () {
            _this.dismissLoading();
        }, 200);
    };
    ;
    NativeService.prototype.dismissLoading = function () {
        if (this.loadingIsOpen) {
            this.loadingIsOpen = false;
            this.loading.dismiss();
        }
    };
    /**
     * 使用cordova-plugin-camera获取照片
     * @param options
     */
    NativeService.prototype.getPicture = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var ops = Object.assign({
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: __WEBPACK_IMPORTED_MODULE_14__Constants__["i" /* QUALITY_SIZE */],
            allowEdit: false,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: __WEBPACK_IMPORTED_MODULE_14__Constants__["g" /* IMAGE_SIZE */],
            targetHeight: __WEBPACK_IMPORTED_MODULE_14__Constants__["g" /* IMAGE_SIZE */],
            saveToPhotoAlbum: false,
            correctOrientation: true //设置摄像机拍摄的图像是否为正确的方向
        }, options);
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            _this.camera.getPicture(ops).then(function (imgData) {
                if (ops.destinationType === _this.camera.DestinationType.DATA_URL) {
                    observer.next('data:image/jpg;base64,' + imgData);
                }
                else {
                    observer.next(imgData);
                }
            }).catch(function (err) {
                if (err == 20) {
                    _this.alert('没有权限,请在设置中开启权限');
                    return;
                }
                if (String(err).indexOf('cancel') != -1) {
                    return;
                }
                _this.logger.log(err, '使用cordova-plugin-camera获取照片失败');
                _this.alert('获取照片失败');
                observer.error(false);
            });
        });
    };
    ;
    /**
     * 通过拍照获取照片
     * @param options
     */
    NativeService.prototype.getPictureByCamera = function (options) {
        if (options === void 0) { options = {}; }
        var ops = Object.assign({
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL //DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
        }, options);
        return this.getPicture(ops);
    };
    ;
    /**
     * 通过图库获取照片
     * @param options
     */
    NativeService.prototype.getPictureByPhotoLibrary = function (options) {
        if (options === void 0) { options = {}; }
        var ops = Object.assign({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL //DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
        }, options);
        return this.getPicture(ops);
    };
    ;
    /**
     * 通过图库选择多图
     * @param options
     */
    NativeService.prototype.getMultiplePicture = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var that = this;
        var ops = Object.assign({
            maximumImagesCount: 6,
            width: __WEBPACK_IMPORTED_MODULE_14__Constants__["g" /* IMAGE_SIZE */],
            height: __WEBPACK_IMPORTED_MODULE_14__Constants__["g" /* IMAGE_SIZE */],
            quality: __WEBPACK_IMPORTED_MODULE_14__Constants__["i" /* QUALITY_SIZE */] //图像质量，范围为0 - 100
        }, options);
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            _this.imagePicker.getPictures(ops).then(function (files) {
                var destinationType = options['destinationType'] || 0; //0:base64字符串,1:图片url
                if (destinationType === 1) {
                    observer.next(files);
                }
                else {
                    var imgBase64s_1 = []; //base64字符串数组
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var fileUrl = files_1[_i];
                        that.convertImgToBase64(fileUrl).subscribe(function (base64) {
                            imgBase64s_1.push(base64);
                            if (imgBase64s_1.length === files.length) {
                                observer.next(imgBase64s_1);
                            }
                        });
                    }
                }
            }).catch(function (err) {
                _this.logger.log(err, '通过图库选择多图失败');
                _this.alert('获取照片失败');
                observer.error(false);
            });
        });
    };
    ;
    /**
     * 根据图片绝对路径转化为base64字符串
     * @param path 绝对路径
     */
    NativeService.prototype.convertImgToBase64 = function (path) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            _this.file.resolveLocalFilesystemUrl(path).then(function (fileEnter) {
                fileEnter.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        observer.next(this.result);
                    };
                    reader.readAsDataURL(file);
                });
            }).catch(function (err) {
                _this.logger.log(err, '根据图片绝对路径转化为base64字符串失败');
                observer.error(false);
            });
        });
    };
    /**
     * 获得app版本号,如0.01
     * @description  对应/config.xml中version的值
     */
    NativeService.prototype.getVersionNumber = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            _this.appVersion.getVersionNumber().then(function (value) {
                observer.next(value);
            }).catch(function (err) {
                _this.logger.log(err, '获得app版本号失败');
                observer.error(false);
            });
        });
    };
    /**
     * 获得app name,如现场作业
     * @description  对应/config.xml中name的值
     */
    NativeService.prototype.getAppName = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            _this.appVersion.getAppName().then(function (value) {
                observer.next(value);
            }).catch(function (err) {
                _this.logger.log(err, '获得app name失败');
                observer.error(false);
            });
        });
    };
    /**
     * 获得app包名/id,如com.kit.ionic2tabs
     * @description  对应/config.xml中id的值
     */
    NativeService.prototype.getPackageName = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            _this.appVersion.getPackageName().then(function (value) {
                observer.next(value);
            }).catch(function (err) {
                _this.logger.log(err, '获得app包名失败');
                observer.error(false);
            });
        });
    };
    /**
     * 拨打电话
     * @param number
     */
    NativeService.prototype.callNumber = function (number) {
        var _this = this;
        this.cn.callNumber(number, true)
            .then(function () { return console.log('成功拨打电话:' + number); })
            .catch(function (err) { return _this.logger.log(err, '拨打电话失败'); });
    };
    /**
     * 扫描二维码
     * @returns {any}
     */
    NativeService.prototype.scan = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            _this.barcodeScanner.scan().then(function (barcodeData) {
                observer.next(barcodeData.text);
            }).catch(function (err) {
                _this.logger.log(err, '扫描二维码失败');
                observer.error(false);
            });
        });
    };
    /**
     * 获得用户当前坐标
     */
    NativeService.prototype.getUserLocation = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            if (_this.isMobile()) {
                _this.assertLocationService().subscribe(function (res) {
                    if (res) {
                        _this.assertLocationAuthorization().subscribe(function (res) {
                            if (res) {
                                return _this.getLocation(observer);
                            }
                        }, function (err) {
                            observer.error(err);
                        });
                    }
                }, function (err) {
                    observer.error(err);
                });
            }
            else {
                console.log('非手机环境,即测试环境返回固定坐标');
                observer.next({ 'lng': 113.350912, 'lat': 23.119495 });
            }
        });
    };
    NativeService.prototype.getLocation = function (observer) {
        var _this = this;
        LocationPlugin.getLocation(function (data) {
            observer.next({ 'lng': data.longitude, 'lat': data.latitude });
        }, function (msg) {
            if (msg.indexOf('缺少定位权限') != -1 || (_this.isIos() && msg.indexOf('定位失败') != -1)) {
                _this.alertCtrl.create({
                    title: '缺少定位权限',
                    subTitle: '请在手机设置或app权限管理中开启',
                    buttons: [{ text: '取消' },
                        {
                            text: '去开启',
                            handler: function () {
                                _this.diagnostic.switchToSettings();
                            }
                        }
                    ]
                }).present();
            }
            else if (msg.indexOf('WIFI信息不足') != -1) {
                alert('定位失败,请确保连上WIFI或者关掉WIFI只开流量数据');
            }
            else if (msg.indexOf('网络连接异常') != -1) {
                alert('网络连接异常,请检查您的网络是否畅通');
            }
            else {
                alert('获取位置错误,错误消息:' + msg);
                _this.logger.log(msg, '获取位置失败');
            }
            observer.error('获取位置失败');
        });
    };
    /**
     * 地图导航
     * @param startPoint 开始坐标
     * @param endPoint 结束坐标
     * @param type 0驾车实时导航,1驾车模拟导航,2步行实时导航,3步行模拟导航.默认为0
     */
    NativeService.prototype.navigation = function (startPoint, endPoint, type) {
        var _this = this;
        if (type === void 0) { type = 1; }
        return __WEBPACK_IMPORTED_MODULE_16_rxjs__["Observable"].create(function (observer) {
            if (_this.platform.is('mobile') && !_this.platform.is('mobileweb')) {
                AMapNavigation.navigation({
                    lng: startPoint.lng,
                    lat: startPoint.lat
                }, {
                    lng: endPoint.lng,
                    lat: endPoint.lat
                }, type, function (message) {
                    observer.next(message);
                }, function (err) {
                    _this.logger.log(err, '导航失败');
                    _this.alert('导航失败');
                    observer.error(false);
                });
            }
            else {
                _this.alert('非手机环境不能导航');
                observer.error(false);
            }
        });
    };
    return NativeService;
}());
NativeService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_app_version__["a" /* AppVersion */],
        __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_6__ionic_native_toast__["a" /* Toast */],
        __WEBPACK_IMPORTED_MODULE_7__ionic_native_file__["a" /* File */],
        __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__["a" /* InAppBrowser */],
        __WEBPACK_IMPORTED_MODULE_9__ionic_native_image_picker__["a" /* ImagePicker */],
        __WEBPACK_IMPORTED_MODULE_10__ionic_native_network__["a" /* Network */],
        __WEBPACK_IMPORTED_MODULE_11__ionic_native_app_minimize__["a" /* AppMinimize */],
        __WEBPACK_IMPORTED_MODULE_12__ionic_native_call_number__["a" /* CallNumber */],
        __WEBPACK_IMPORTED_MODULE_13__ionic_native_barcode_scanner__["a" /* BarcodeScanner */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_15__GlobalData__["a" /* GlobalData */],
        __WEBPACK_IMPORTED_MODULE_17__Logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_18__ionic_native_diagnostic__["a" /* Diagnostic */],
        __WEBPACK_IMPORTED_MODULE_19__ionic_native_code_push__["a" /* CodePush */]])
], NativeService);

//# sourceMappingURL=NativeService.js.map

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_SERVE_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return FILE_SERVE_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return APP_VERSION_SERVE_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return IS_DEBUG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return DEFAULT_AVATAR; });
/* unused harmony export PAGE_SIZE */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return IMAGE_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return QUALITY_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return REQUEST_TIMEOUT; });
/* unused harmony export ENABLE_FUNDEBUG */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return FUNDEBUG_API_KEY; });
/* unused harmony export APK_DOWNLOAD */
/* unused harmony export APP_DOWNLOAD */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return CODE_PUSH_DEPLOYMENT_KEY; });
/*----------------------------------------后台Api地址----------------------------------------*/
/*----------------------------------------后台Api地址----------------------------------------*/ var APP_SERVE_URL = 'http://118.31.12.161:3001/api/';
// export const APP_SERVE_URL = 'http://localhost:3001/api/';
/*----------------------------------------文件服务器地址----------------------------------------*/
var FILE_SERVE_URL = 'http://172.16.19.86/kit_file_server/'; //文件服务:测试环境
/*----------------------------------------app版本升级服务地址----------------------------------------*/
//文件服务:测试环境
var APP_VERSION_SERVE_URL = 'http://172.16.19.86:8111/api/'; //app版本升级服务;测试环境,查询app最新版本号,更新日志等信息.
//app版本升级服务;测试环境,查询app最新版本号,更新日志等信息.
var IS_DEBUG = false; //是否开发(调试)模式
//是否开发(调试)模式
var DEFAULT_AVATAR = './assets/imgs/avatar-1.png'; //用户默认头像
//用户默认头像
var PAGE_SIZE = 5; //默认分页大小
//默认分页大小
var IMAGE_SIZE = 1024; //拍照/从相册选择照片压缩大小
//拍照/从相册选择照片压缩大小
var QUALITY_SIZE = 94; //图像压缩质量，范围为0 - 100
//图像压缩质量，范围为0 - 100
var REQUEST_TIMEOUT = 20000; //请求超时时间,单位为毫秒
//请求超时时间,单位为毫秒
var ENABLE_FUNDEBUG = false; //是否启用fundebug日志监控
//是否启用fundebug日志监控
var FUNDEBUG_API_KEY = '3701a358f79b7daa39592255bde6c3c8772efad642883e42dbb65f3f8ffbae11'; //去https://fundebug.com/申请key
//去https://fundebug.com/申请key
var APK_DOWNLOAD = 'http://omzo595hi.bkt.clouddn.com/ionic2_tabs.apk'; //android apk下载完整地址,用于android本地升级
//android apk下载完整地址,用于android本地升级
var APP_DOWNLOAD = 'http://omzo595hi.bkt.clouddn.com/download.html'; //app网页下载地址,用于ios升级或android本地升级失败
//code push 部署key
//app网页下载地址,用于ios升级或android本地升级失败
var CODE_PUSH_DEPLOYMENT_KEY = {
    'android': {
        'Production': 'i0LgJRugiIfjVYTgmXs9go45Xc7g26690215-d954-4697-a879-90e0c4612b59',
        'Staging': 'WY29_Zyq_hg0eB3TSTGaKRSKPE6k26690215-d954-4697-a879-90e0c4612b59'
    },
    'ios': {
        'Production': 'kn3VJ28z0hB_zQYnW-KnblldnBzN26690215-d954-4697-a879-90e0c4612b59',
        'Staging': 'SRoxClVMoed8SgwIRxeVCPWx26Fk26690215-d954-4697-a879-90e0c4612b59'
    }
};
//# sourceMappingURL=Constants.js.map

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Utils; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by yanxiaojun617@163.com on 12-27.
 */

/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
var Utils = Utils_1 = (function () {
    function Utils() {
    }
    Utils.isEmpty = function (value) {
        return value == null || typeof value === 'string' && value.length === 0;
    };
    Utils.isNotEmpty = function (value) {
        return !Utils_1.isEmpty(value);
    };
    /**
     * 格式“是”or“否”
     * @param value
     * @returns {string|string}
     */
    Utils.formatYesOrNo = function (value) {
        return value == 1 ? '是' : (value == '0' ? '否' : null);
    };
    /**
     * 日期对象转为日期字符串
     * @param date 需要格式化的日期对象
     * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
     * @example  dateFormat(new Date())                               "2017-02-28"
     * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
     * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
     * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
     * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
     * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
     * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
     * @returns {string}
     */
    Utils.dateFormat = function (date, sFormat) {
        if (sFormat === void 0) { sFormat = 'yyyy-MM-dd'; }
        var time = {
            Year: 0,
            TYear: '0',
            Month: 0,
            TMonth: '0',
            Day: 0,
            TDay: '0',
            Hour: 0,
            THour: '0',
            hour: 0,
            Thour: '0',
            Minute: 0,
            TMinute: '0',
            Second: 0,
            TSecond: '0',
            Millisecond: 0
        };
        time.Year = date.getFullYear();
        time.TYear = String(time.Year).substr(2);
        time.Month = date.getMonth() + 1;
        time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
        time.Day = date.getDate();
        time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
        time.Hour = date.getHours();
        time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
        time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
        time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
        time.Minute = date.getMinutes();
        time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
        time.Second = date.getSeconds();
        time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
        time.Millisecond = date.getMilliseconds();
        return sFormat.replace(/yyyy/ig, String(time.Year))
            .replace(/yyy/ig, String(time.Year))
            .replace(/yy/ig, time.TYear)
            .replace(/y/ig, time.TYear)
            .replace(/MM/g, time.TMonth)
            .replace(/M/g, String(time.Month))
            .replace(/dd/ig, time.TDay)
            .replace(/d/ig, String(time.Day))
            .replace(/HH/g, time.THour)
            .replace(/H/g, String(time.Hour))
            .replace(/hh/g, time.Thour)
            .replace(/h/g, String(time.hour))
            .replace(/mm/g, time.TMinute)
            .replace(/m/g, String(time.Minute))
            .replace(/ss/ig, time.TSecond)
            .replace(/s/ig, String(time.Second))
            .replace(/fff/ig, String(time.Millisecond));
    };
    /**
     * 返回字符串长度，中文计数为2
     * @param str
     * @returns {number}
     */
    Utils.strLength = function (str) {
        var len = 0;
        for (var i = 0, length_1 = str.length; i < length_1; i++) {
            str.charCodeAt(i) > 255 ? len += 2 : len++;
        }
        return len;
    };
    /**
     * 把url中的双斜杠替换为单斜杠
     * 如:http://localhost:8080//api//demo.替换后http://localhost:8080/api/demo
     * @param url
     * @returns {string}
     */
    Utils.formatUrl = function (url) {
        if (url === void 0) { url = ''; }
        var index = 0;
        if (url.startsWith('http')) {
            index = 7;
        }
        return url.substring(0, index) + url.substring(index).replace(/\/\/*/g, '/');
    };
    Utils.sessionStorageGetItem = function (key) {
        var jsonString = sessionStorage.getItem(key);
        if (jsonString) {
            return JSON.parse(jsonString);
        }
        return null;
    };
    Utils.sessionStorageSetItem = function (key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    };
    Utils.sessionStorageRemoveItem = function (key) {
        sessionStorage.removeItem(key);
    };
    Utils.sessionStorageClear = function () {
        sessionStorage.clear();
    };
    /**
     * 字符串加密
     * @param str
     * @returns {any}
     */
    Utils.hex_md5 = function (str) {
        return hex_md5(str);
    };
    /** 产生一个随机的32位长度字符串 */
    Utils.uuid = function () {
        var text = "";
        var possible = "abcdef0123456789";
        for (var i = 0; i < 19; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text + new Date().getTime();
    };
    return Utils;
}());
/**
 * 每次调用sequence加1
 * @type {()=>number}
 */
Utils.getSequence = (function () {
    var sequence = 1;
    return function () {
        return ++sequence;
    };
})();
Utils = Utils_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [])
], Utils);

var Utils_1;
//# sourceMappingURL=Utils.js.map

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Logger; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fundebug_javascript__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fundebug_javascript___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fundebug_javascript__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by yanxiaojun617@163.com on 07-25.
 */



/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
var Logger = (function () {
    function Logger(globalData) {
        this.globalData = globalData;
    }
    Logger.prototype.log = function (err, action, other) {
        if (other === void 0) { other = null; }
        console.log('Logger.log：action-' + action);
        other && console.log(other);
        console.log(err);
        __WEBPACK_IMPORTED_MODULE_2_fundebug_javascript__["notifyError"](err, {
            metaData: {
                action: action,
                other: other,
                user: { id: this.globalData.userId, name: this.globalData.phone }
            }
        });
    };
    Logger.prototype.httpLog = function (err, msg, other) {
        if (other === void 0) { other = {}; }
        console.log('Logger.httpLog：msg-' + msg);
        __WEBPACK_IMPORTED_MODULE_2_fundebug_javascript__["notifyHttpError"](err, {
            metaData: {
                action: msg,
                other: other,
                user: { id: this.globalData.userId, name: this.globalData.phone }
            }
        });
    };
    return Logger;
}());
Logger = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__GlobalData__["a" /* GlobalData */]])
], Logger);

//# sourceMappingURL=Logger.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DoctorListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__doctor_doctor__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_CommonService__ = __webpack_require__(37);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DoctorListPage = (function () {
    function DoctorListPage(navCtrl, params, commonService) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.commonService = commonService;
        this.title = this.params.get('name') || '全部医生';
    }
    DoctorListPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.commonService.getDoctorList().subscribe(function (resp) {
            resp.data.map(function (o) {
                o.adeptArr = o.adept ? o.adept.split(',') : [];
                o.rank = o.rank.toString().replace('0', '').replace('1', '主任医师').replace('2', '副主任医师').replace('3', '主治医师').replace('4', '住院医师').replace('5', '医师');
                o.price = parseFloat(o.price);
            });
            _this.doctorList = resp.data;
        });
    };
    DoctorListPage.prototype.startDoctorPage = function (id) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__doctor_doctor__["a" /* DoctorPage */], { id: id });
    };
    return DoctorListPage;
}());
DoctorListPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-doctor-list',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\doctor-list\doctor-list.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>{{title}}</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content style="background: #eee;">\n  <ion-list class="doctor-list">\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage(item.id)" *ngFor="let item of doctorList">\n      <ion-thumbnail item-start>\n        <img [src]="item.avatar">\n      </ion-thumbnail>\n      <h2>{{item.name}}</h2>\n      <p><small>{{item.hospital}} {{item.rank}}</small></p>\n      <p><span *ngFor="let child of adeptArr">{{child}}</span></p>\n      <p><em>￥{{item.price}}元/次</em> <!-- 1441人付款，190条评价 --></p>\n    </button>\n    <!-- <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-2.png">\n      </ion-thumbnail>\n      <h2>李医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-1.png">\n      </ion-thumbnail>\n      <h2>张医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-2.png">\n      </ion-thumbnail>\n      <h2>莉医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button>\n    <button ion-item class="home-doctor-info" (click)="startDoctorPage()">\n      <ion-thumbnail item-start>\n        <img src="assets/imgs/avatar-1.png">\n      </ion-thumbnail>\n      <h2>黄医师</h2>\n      <p><small>仁济医院（三甲） 主任医师</small></p>\n      <p><span>五官科</span><span>咽喉炎</span><span>耳部疾病</span></p>\n      <p><em>￥120元/次</em> 1441人付款，190条评价</p>\n    </button> -->\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\doctor-list\doctor-list.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__service_CommonService__["a" /* CommonService */]])
], DoctorListPage);

//# sourceMappingURL=doctor-list.js.map

/***/ }),

/***/ 741:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModalFromRightEnter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ModalFromRightLeave; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ModalScaleEnter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ModalScaleLeave; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(10);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var ModalFromRightEnter = (function (_super) {
    __extends(ModalFromRightEnter, _super);
    function ModalFromRightEnter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModalFromRightEnter.prototype.init = function () {
        _super.prototype.init.call(this);
        var ele = this.enteringView.pageRef().nativeElement;
        var backdrop = new __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["b" /* Animation */](this.plt, ele.querySelector('ion-backdrop'));
        backdrop.beforeStyles({ 'z-index': 0, 'opacity': 0.3, 'visibility': 'visible' });
        var wrapper = new __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["b" /* Animation */](this.plt, ele.querySelector('.modal-wrapper'));
        wrapper.beforeStyles({ 'opacity': 1 });
        wrapper.fromTo('transform', 'translateX(100%)', 'translateX(20%)');
        var contentWrapper = new __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["b" /* Animation */](this.plt, ele.querySelector('ion-content.content'));
        contentWrapper.beforeStyles({ 'width': '80%' });
        this
            .element(this.enteringView.pageRef())
            .duration(300)
            .easing('cubic-bezier(.25, .1, .25, 1)')
            .add(backdrop)
            .add(wrapper)
            .add(contentWrapper);
    };
    return ModalFromRightEnter;
}(__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["n" /* PageTransition */]));

var ModalFromRightLeave = (function (_super) {
    __extends(ModalFromRightLeave, _super);
    function ModalFromRightLeave() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModalFromRightLeave.prototype.init = function () {
        _super.prototype.init.call(this);
        var ele = this.leavingView.pageRef().nativeElement;
        var backdrop = new __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["b" /* Animation */](this.plt, ele.querySelector('ion-backdrop'));
        backdrop.beforeStyles({ 'visibility': 'hidden' });
        var wrapper = new __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["b" /* Animation */](this.plt, ele.querySelector('.modal-wrapper'));
        wrapper.fromTo('transform', 'translateX(20%)', 'translateX(100%)');
        this
            .element(this.leavingView.pageRef())
            .duration(300)
            .easing('cubic-bezier(.25, .1, .25, 1)')
            .add(backdrop)
            .add(wrapper);
    };
    return ModalFromRightLeave;
}(__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["n" /* PageTransition */]));

var ModalScaleEnter = (function (_super) {
    __extends(ModalScaleEnter, _super);
    function ModalScaleEnter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModalScaleEnter.prototype.init = function () {
        _super.prototype.init.call(this);
        var ele = this.enteringView.pageRef().nativeElement;
        var wrapper = new __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["b" /* Animation */](this.plt, ele.querySelector('.modal-wrapper'));
        wrapper.beforeStyles({ 'opacity': 1 });
        wrapper.fromTo('transform', 'scale(0)', 'scale(1)');
        this
            .element(this.enteringView.pageRef())
            .duration(400)
            .easing('cubic-bezier(.1, .7, .1, 1)')
            .add(wrapper);
    };
    return ModalScaleEnter;
}(__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["n" /* PageTransition */]));

var ModalScaleLeave = (function (_super) {
    __extends(ModalScaleLeave, _super);
    function ModalScaleLeave() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModalScaleLeave.prototype.init = function () {
        _super.prototype.init.call(this);
        var ele = this.leavingView.pageRef().nativeElement;
        var wrapper = new __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["b" /* Animation */](this.plt, ele.querySelector('.modal-wrapper'));
        wrapper.fromTo('transform', 'scale(1)', 'scale(0)');
        this
            .element(this.leavingView.pageRef())
            .duration(400)
            .easing('cubic-bezier(.1, .7, .1, 1)')
            .add(wrapper);
    };
    return ModalScaleLeave;
}(__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["n" /* PageTransition */]));

//# sourceMappingURL=modal-transitions.js.map

/***/ }),

/***/ 745:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 299,
	"./af.js": 299,
	"./ar": 300,
	"./ar-dz": 301,
	"./ar-dz.js": 301,
	"./ar-kw": 302,
	"./ar-kw.js": 302,
	"./ar-ly": 303,
	"./ar-ly.js": 303,
	"./ar-ma": 304,
	"./ar-ma.js": 304,
	"./ar-sa": 305,
	"./ar-sa.js": 305,
	"./ar-tn": 306,
	"./ar-tn.js": 306,
	"./ar.js": 300,
	"./az": 307,
	"./az.js": 307,
	"./be": 308,
	"./be.js": 308,
	"./bg": 309,
	"./bg.js": 309,
	"./bm": 310,
	"./bm.js": 310,
	"./bn": 311,
	"./bn.js": 311,
	"./bo": 312,
	"./bo.js": 312,
	"./br": 313,
	"./br.js": 313,
	"./bs": 314,
	"./bs.js": 314,
	"./ca": 315,
	"./ca.js": 315,
	"./cs": 316,
	"./cs.js": 316,
	"./cv": 317,
	"./cv.js": 317,
	"./cy": 318,
	"./cy.js": 318,
	"./da": 319,
	"./da.js": 319,
	"./de": 320,
	"./de-at": 321,
	"./de-at.js": 321,
	"./de-ch": 322,
	"./de-ch.js": 322,
	"./de.js": 320,
	"./dv": 323,
	"./dv.js": 323,
	"./el": 324,
	"./el.js": 324,
	"./en-au": 325,
	"./en-au.js": 325,
	"./en-ca": 326,
	"./en-ca.js": 326,
	"./en-gb": 327,
	"./en-gb.js": 327,
	"./en-ie": 328,
	"./en-ie.js": 328,
	"./en-nz": 329,
	"./en-nz.js": 329,
	"./eo": 330,
	"./eo.js": 330,
	"./es": 331,
	"./es-do": 332,
	"./es-do.js": 332,
	"./es-us": 333,
	"./es-us.js": 333,
	"./es.js": 331,
	"./et": 334,
	"./et.js": 334,
	"./eu": 335,
	"./eu.js": 335,
	"./fa": 336,
	"./fa.js": 336,
	"./fi": 337,
	"./fi.js": 337,
	"./fo": 338,
	"./fo.js": 338,
	"./fr": 339,
	"./fr-ca": 340,
	"./fr-ca.js": 340,
	"./fr-ch": 341,
	"./fr-ch.js": 341,
	"./fr.js": 339,
	"./fy": 342,
	"./fy.js": 342,
	"./gd": 343,
	"./gd.js": 343,
	"./gl": 344,
	"./gl.js": 344,
	"./gom-latn": 345,
	"./gom-latn.js": 345,
	"./gu": 346,
	"./gu.js": 346,
	"./he": 347,
	"./he.js": 347,
	"./hi": 348,
	"./hi.js": 348,
	"./hr": 349,
	"./hr.js": 349,
	"./hu": 350,
	"./hu.js": 350,
	"./hy-am": 351,
	"./hy-am.js": 351,
	"./id": 352,
	"./id.js": 352,
	"./is": 353,
	"./is.js": 353,
	"./it": 354,
	"./it.js": 354,
	"./ja": 355,
	"./ja.js": 355,
	"./jv": 356,
	"./jv.js": 356,
	"./ka": 357,
	"./ka.js": 357,
	"./kk": 358,
	"./kk.js": 358,
	"./km": 359,
	"./km.js": 359,
	"./kn": 360,
	"./kn.js": 360,
	"./ko": 361,
	"./ko.js": 361,
	"./ky": 362,
	"./ky.js": 362,
	"./lb": 363,
	"./lb.js": 363,
	"./lo": 364,
	"./lo.js": 364,
	"./lt": 365,
	"./lt.js": 365,
	"./lv": 366,
	"./lv.js": 366,
	"./me": 367,
	"./me.js": 367,
	"./mi": 368,
	"./mi.js": 368,
	"./mk": 369,
	"./mk.js": 369,
	"./ml": 370,
	"./ml.js": 370,
	"./mr": 371,
	"./mr.js": 371,
	"./ms": 372,
	"./ms-my": 373,
	"./ms-my.js": 373,
	"./ms.js": 372,
	"./mt": 374,
	"./mt.js": 374,
	"./my": 375,
	"./my.js": 375,
	"./nb": 376,
	"./nb.js": 376,
	"./ne": 377,
	"./ne.js": 377,
	"./nl": 378,
	"./nl-be": 379,
	"./nl-be.js": 379,
	"./nl.js": 378,
	"./nn": 380,
	"./nn.js": 380,
	"./pa-in": 381,
	"./pa-in.js": 381,
	"./pl": 382,
	"./pl.js": 382,
	"./pt": 383,
	"./pt-br": 384,
	"./pt-br.js": 384,
	"./pt.js": 383,
	"./ro": 385,
	"./ro.js": 385,
	"./ru": 386,
	"./ru.js": 386,
	"./sd": 387,
	"./sd.js": 387,
	"./se": 388,
	"./se.js": 388,
	"./si": 389,
	"./si.js": 389,
	"./sk": 390,
	"./sk.js": 390,
	"./sl": 391,
	"./sl.js": 391,
	"./sq": 392,
	"./sq.js": 392,
	"./sr": 393,
	"./sr-cyrl": 394,
	"./sr-cyrl.js": 394,
	"./sr.js": 393,
	"./ss": 395,
	"./ss.js": 395,
	"./sv": 396,
	"./sv.js": 396,
	"./sw": 397,
	"./sw.js": 397,
	"./ta": 398,
	"./ta.js": 398,
	"./te": 399,
	"./te.js": 399,
	"./tet": 400,
	"./tet.js": 400,
	"./th": 401,
	"./th.js": 401,
	"./tl-ph": 402,
	"./tl-ph.js": 402,
	"./tlh": 403,
	"./tlh.js": 403,
	"./tr": 404,
	"./tr.js": 404,
	"./tzl": 405,
	"./tzl.js": 405,
	"./tzm": 406,
	"./tzm-latn": 407,
	"./tzm-latn.js": 407,
	"./tzm.js": 406,
	"./uk": 408,
	"./uk.js": 408,
	"./ur": 409,
	"./ur.js": 409,
	"./uz": 410,
	"./uz-latn": 411,
	"./uz-latn.js": 411,
	"./uz.js": 410,
	"./vi": 412,
	"./vi.js": 412,
	"./x-pseudo": 413,
	"./x-pseudo.js": 413,
	"./yo": 414,
	"./yo.js": 414,
	"./zh-cn": 415,
	"./zh-cn.js": 415,
	"./zh-hk": 416,
	"./zh-hk.js": 416,
	"./zh-tw": 417,
	"./zh-tw.js": 417
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 745;

/***/ }),

/***/ 89:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Utils__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__GlobalData__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__NativeService__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Constants__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Logger__ = __webpack_require__(52);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by yanxiaojun617@163.com on 12-27.
 */








var HttpService = HttpService_1 = (function () {
    function HttpService(http, globalData, logger, nativeService) {
        this.http = http;
        this.globalData = globalData;
        this.logger = logger;
        this.nativeService = nativeService;
    }
    HttpService.prototype.request = function (url, options) {
        var _this = this;
        url = this.formatUrlDefaultApi(url);
        if (url.indexOf(__WEBPACK_IMPORTED_MODULE_6__Constants__["a" /* APP_SERVE_URL */]) != -1) {
            options = this.addAuthorizationHeader(options);
        }
        __WEBPACK_IMPORTED_MODULE_6__Constants__["h" /* IS_DEBUG */] && console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
        this.nativeService.showLoading();
        return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].create(function (observer) {
            _this.http.request(url, options).timeout(__WEBPACK_IMPORTED_MODULE_6__Constants__["j" /* REQUEST_TIMEOUT */]).subscribe(function (res) {
                var result = _this.requestSuccessHandle(url, options, res);
                result.success ? observer.next(result.data) : observer.error(result.data);
            }, function (err) {
                observer.error(_this.requestFailedHandle(url, options, err));
            });
        });
    };
    HttpService.prototype.get = function (url, paramMap) {
        if (paramMap === void 0) { paramMap = null; }
        return this.request(url, new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestMethod */].Get,
            search: HttpService_1.buildURLSearchParams(paramMap)
        }));
    };
    HttpService.prototype.post = function (url, body) {
        if (body === void 0) { body = {}; }
        return this.request(url, new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestMethod */].Post,
            body: body,
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        }));
    };
    HttpService.prototype.postFormData = function (url, paramMap) {
        if (paramMap === void 0) { paramMap = null; }
        return this.request(url, new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestMethod */].Post,
            body: HttpService_1.buildURLSearchParams(paramMap).toString(),
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            })
        }));
    };
    HttpService.prototype.put = function (url, body) {
        if (body === void 0) { body = {}; }
        return this.request(url, new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestMethod */].Put,
            body: body
        }));
    };
    HttpService.prototype.delete = function (url, paramMap) {
        if (paramMap === void 0) { paramMap = null; }
        return this.request(url, new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestMethod */].Delete,
            search: HttpService_1.buildURLSearchParams(paramMap).toString()
        }));
    };
    HttpService.prototype.patch = function (url, body) {
        if (body === void 0) { body = {}; }
        return this.request(url, new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* RequestOptions */]({
            method: __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestMethod */].Patch,
            body: body
        }));
    };
    /**
     * 处理请求成功事件
     */
    HttpService.prototype.requestSuccessHandle = function (url, options, res) {
        this.nativeService.hideLoading();
        var json = res.json();
        if (url.indexOf(__WEBPACK_IMPORTED_MODULE_6__Constants__["a" /* APP_SERVE_URL */]) != -1) {
            if (!json.success) {
                __WEBPACK_IMPORTED_MODULE_6__Constants__["h" /* IS_DEBUG */] && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', res);
                this.nativeService.showToast(json.message || '请求失败,请稍后再试!');
                return { success: false, data: json.data };
            }
            else {
                __WEBPACK_IMPORTED_MODULE_6__Constants__["h" /* IS_DEBUG */] && console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
                return { success: true, data: json.data };
            }
        }
        else {
            return { success: true, data: json };
        }
    };
    /**
     * 处理请求失败事件
     */
    HttpService.prototype.requestFailedHandle = function (url, options, err) {
        __WEBPACK_IMPORTED_MODULE_6__Constants__["h" /* IS_DEBUG */] && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
        this.nativeService.hideLoading();
        if (err instanceof __WEBPACK_IMPORTED_MODULE_2_rxjs__["TimeoutError"]) {
            this.nativeService.showToast('请求超时,请稍后再试!');
        }
        else if (!this.nativeService.isConnecting()) {
            this.nativeService.showToast('请连接网络');
        }
        else {
            var status_1 = err.status;
            var msg = '请求发生异常';
            if (status_1 === 0) {
                msg = '请求失败，请求响应出错';
            }
            else if (status_1 === 404) {
                msg = '请求失败，未找到请求地址';
            }
            else if (status_1 === 500) {
                msg = '请求失败，服务器出错，请稍后再试';
            }
            this.nativeService.showToast(msg);
            this.logger.httpLog(err, msg, {
                url: url,
                status: status_1
            });
        }
        return err;
    };
    /**
     * 将对象转为查询参数
     */
    HttpService.buildURLSearchParams = function (paramMap) {
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["f" /* URLSearchParams */]();
        if (!paramMap) {
            return params;
        }
        for (var key in paramMap) {
            var val = paramMap[key];
            if (val instanceof Date) {
                val = __WEBPACK_IMPORTED_MODULE_3__Utils__["a" /* Utils */].dateFormat(val, 'yyyy-MM-dd hh:mm:ss');
            }
            params.set(key, val);
        }
        return params;
    };
    /**
     * 格式化url使用默认API地址:APP_SERVE_URL
     */
    HttpService.prototype.formatUrlDefaultApi = function (url) {
        if (url === void 0) { url = ''; }
        return __WEBPACK_IMPORTED_MODULE_3__Utils__["a" /* Utils */].formatUrl(url.startsWith('http') ? url : __WEBPACK_IMPORTED_MODULE_6__Constants__["a" /* APP_SERVE_URL */] + url);
    };
    /**
     * 给请求头添加权限认证token
     */
    HttpService.prototype.addAuthorizationHeader = function (options) {
        var token = this.globalData.token;
        if (options.headers) {
            options.headers.append('Authorization', token);
        }
        else {
            options.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({
                'Authorization': token
            });
        }
        return options;
    };
    return HttpService;
}());
HttpService = HttpService_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */],
        __WEBPACK_IMPORTED_MODULE_4__GlobalData__["a" /* GlobalData */],
        __WEBPACK_IMPORTED_MODULE_7__Logger__["a" /* Logger */],
        __WEBPACK_IMPORTED_MODULE_5__NativeService__["a" /* NativeService */]])
], HttpService);

var HttpService_1;
//# sourceMappingURL=HttpService.js.map

/***/ }),

/***/ 90:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DoctorPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__buy_buy__ = __webpack_require__(287);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__service_CommonService__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(33);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DoctorPage = (function () {
    function DoctorPage(navCtrl, params, toastCtrl, commonService, sanitizer) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.toastCtrl = toastCtrl;
        this.commonService = commonService;
        this.sanitizer = sanitizer;
        this.doctor = {
            name: '',
            avatar: '',
            rank: '',
            hospital: '',
            price: '--',
            consult_price: '--',
            about: '',
            intro: '',
            adeptArr: []
        };
        this.id = this.params.get('id') || 0;
    }
    DoctorPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.commonService.getDoctorById(this.id).subscribe(function (resp) {
            resp.rank = resp.rank.toString().replace('0', '').replace('1', '主任医师').replace('2', '副主任医师').replace('3', '主治医师').replace('4', '住院医师').replace('5', '医师');
            resp.adeptArr = resp.adept.split(',');
            resp.price = parseFloat(resp.price);
            resp.consult_price = parseFloat(resp.consult_price);
            _this.doctor = resp;
        });
    };
    DoctorPage.prototype.assembleHTML = function (strHTML) {
        return this.sanitizer.bypassSecurityTrustHtml(strHTML);
    };
    DoctorPage.prototype.startBuyPage = function (name, price, avatar) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__buy_buy__["a" /* BuyPage */], { name: name, price: price, avatar: avatar });
    };
    DoctorPage.prototype.startVisitPage = function () {
        var toast = this.toastCtrl.create({
            message: '诊后咨询只向复诊患者开放',
            duration: 3000,
            position: 'middle'
        });
        toast.onDidDismiss(function () {
            // console.log('Dismissed toast');
        });
        toast.present();
    };
    DoctorPage.prototype.startOfflinePage = function () {
        var toast = this.toastCtrl.create({
            message: '尚未开放',
            duration: 3000,
            position: 'middle'
        });
        toast.onDidDismiss(function () {
            // console.log('Dismissed toast');
        });
        toast.present();
    };
    DoctorPage.prototype.startNoticePage = function () {
        var toast = this.toastCtrl.create({
            message: '医生尚未发布公告',
            duration: 3000,
            position: 'middle'
        });
        toast.onDidDismiss(function () {
            // console.log('Dismissed toast');
        });
        toast.present();
    };
    return DoctorPage;
}());
DoctorPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-doctor',template:/*ion-inline-start:"C:\Users\Lonk\projects\ionic-tang\src\pages\doctor\doctor.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>医生信息</ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content style="background: #eee;">\n  <ion-list class="no-border">\n    <!-- <ion-item class="doctor-avatar-bg" style="background:url(../assets/imgs/avatar-1.png) no-repeat;background-size: 100% auto"> -->\n    <ion-item class="doctor-avatar-bg">\n      <h2>{{doctor.name}} · <small>{{doctor.rank}}</small></h2>\n      <p>{{doctor.hospital}}</p>\n      <p><small>服务1832人 · 84%复诊率 · 190条评价</small></p>\n    </ion-item>\n    <ion-item class="chat">\n      <h2>{{doctor.price}}元/次 <span>图文 · 语音</span></h2>\n      <p>医生将在24小时内与您图文交流、辩证开方</p>\n      <button ion-button item-end (click)="startBuyPage(doctor.name, doctor.price, doctor.avatar)">图文问诊</button>\n    </ion-item>\n  </ion-list>\n  <ion-list class="no-border">\n    <ion-item class="chat">\n      <h2>{{doctor.consult_price}}元/5次 <span>图文 · 语音</span></h2>\n      <p>医生将在24小时内回答您的诊后问题</p>\n      <button ion-button item-end (click)="startVisitPage()">诊后咨询</button>\n    </ion-item>\n  </ion-list>\n  <ion-list class="no-border">\n    <button ion-item (click)="startOfflinePage()">\n      <ion-icon name="paper-plane" item-start></ion-icon>\n      约见线下面诊\n    </button>\n    <button ion-item (click)="startNoticePage()">\n      <ion-icon name="flag" item-start></ion-icon>\n      医生公告\n    </button>\n  </ion-list>\n  <ion-list class="no-border">\n    <ion-item class="adept">\n      <br />\n      <h2 text-center>· 擅长调理 ·</h2>\n      <br />\n      <!-- <p text-wrap><span>皮肤科</span><span>痘痘痤疮</span><span>脱发</span><span>湿疹</span><span>面部色斑</span></p> -->\n      <p text-wrap><span *ngFor="let child of doctor.adeptArr">{{child}}</span></p>\n      <br />\n    </ion-item>\n  </ion-list>\n<!--   <ion-list class="no-border">\n    <ion-item>\n      <p>战“痘”专家——皮肤健康才会颜值爆表！</p>\n    </ion-item>\n  </ion-list> -->\n  <ion-list class="no-border">\n    <ion-item>\n      <br />\n      <h2 text-center> · 关于我 · </h2>\n      <br />\n      <!-- <img src="../assets/imgs/icon-14.png" /> -->\n      <div text-wrap class="pmain_text" [innerHTML]="assembleHTML(doctor.about)"></div>\n      <!-- <p text-wrap>有人说最可悲的是“青春不在青春痘还在”，岁月悠悠，长在你脸上的已经不是青春的“痘”，而是成人痤疮。痘痘是穿越青春的痛</p> -->\n      <br />\n    </ion-item>\n  </ion-list>\n  <ion-list class="no-border">\n    <ion-item>\n      <br />\n      <h2 text-center> · 我的简介 · </h2>\n      <br />\n      <div text-wrap class="pmain_text" [innerHTML]="assembleHTML(doctor.intro)"></div>\n      <br />\n    </ion-item>\n  </ion-list>\n  <ion-list class="no-border">\n    <ion-item>\n      <br />\n      <h2 text-center> · 评价 · </h2>\n    </ion-item>\n    <ion-item class="evaluate">\n      <p><span class="red">^-^ 很满意</span> 15*******98 <span class="pull-right">2017-09-20 18:03:32</span></p>\n      <p text-wrap><em>响应速度很快</em><em>回答很专业</em><em>意见很有帮助</em><em>讲解很细致</em><em>回答很及时</em></p>\n      <p text-wrap>痘痘越来越好了，又开了两周的药，继续配合大夫，要把痘痘治好，先治痘痘再治黄褐斑</p>\n      <p>症状描述：<small>暂未填写</small></p>\n    </ion-item>\n    <ion-item class="evaluate">\n      <p><span class="red">^-^ 很满意</span> 15*******98 <em class="pull-right">2017-09-20 18:03:32</em></p>\n      <p text-wrap><em>响应速度很快</em><em>回答很专业</em><em>意见很有帮助</em><em>讲解很细致</em><em>回答很及时</em></p>\n      <p text-wrap>痘痘越来越好了，又开了两周的药，继续配合大夫，要把痘痘治好，先治痘痘再治黄褐斑</p>\n      <p>症状描述：<small>暂未填写</small></p>\n    </ion-item>\n    <ion-item class="evaluate">\n      <p><span class="red">^-^ 很满意</span> 15*******98 <em class="pull-right">2017-09-20 18:03:32</em></p>\n      <p text-wrap><em>响应速度很快</em><em>回答很专业</em><em>意见很有帮助</em><em>讲解很细致</em><em>回答很及时</em></p>\n      <p text-wrap>痘痘越来越好了，又开了两周的药，继续配合大夫，要把痘痘治好，先治痘痘再治黄褐斑</p>\n      <p>症状描述：<small>暂未填写</small></p>\n    </ion-item>\n    <ion-item class="evaluate">\n      <p><span class="red">^-^ 很满意</span> 15*******98 <em class="pull-right">2017-09-20 18:03:32</em></p>\n      <p text-wrap><em>响应速度很快</em><em>回答很专业</em><em>意见很有帮助</em><em>讲解很细致</em><em>回答很及时</em></p>\n      <p text-wrap>痘痘越来越好了，又开了两周的药，继续配合大夫，要把痘痘治好，先治痘痘再治黄褐斑</p>\n      <p>症状描述：<small>暂未填写</small></p>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\Users\Lonk\projects\ionic-tang\src\pages\doctor\doctor.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ToastController */], __WEBPACK_IMPORTED_MODULE_3__service_CommonService__["a" /* CommonService */], __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */]])
], DoctorPage);

//# sourceMappingURL=doctor.js.map

/***/ })

},[422]);
//# sourceMappingURL=main.js.map