/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import {Injectable} from "@angular/core";
import {Storage} from '@ionic/storage';
import {NativeService} from "./NativeService";
import {JPush} from "../../typings/modules/jpush/index";
import {Observable} from "rxjs";
import {DEFAULT_AVATAR} from "./Constants";
import {FileService} from "./FileService";
import {FileObj} from "../model/FileObj";
import {Utils} from "./Utils";
import {Logger} from "./Logger";
import {Events} from "ionic-angular";
import {GlobalData} from "./GlobalData";
import * as fundebug from "fundebug-javascript";
declare var AlloyLever;

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class Helper {

  constructor(private jPush: JPush,
              public logger: Logger,
              private fileService: FileService,
              private nativeService: NativeService,
              private storage: Storage,
              private events: Events,
              private globalData: GlobalData) {
  }

  /**
   * 设置日志监控app的版本号
   */
  funDebugInit() {
    if (this.nativeService.isMobile()) {
      this.nativeService.getVersionNumber().subscribe(version => {
        fundebug.appversion = version;
      })
    }
  }

  /**
   * AlloyLever,一款本地"开发者工具"
   * 文档:https://github.com/AlloyTeam/AlloyLever
   */
  alloyLeverInit(){
    AlloyLever.config({
      cdn:'http://s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js',  //vconsole的CDN地址
      /*reportUrl: "//a.qq.com",  //错误上报地址
      reportPrefix: 'qun',    //错误上报msg前缀，一般用于标识业务类型
      reportKey: 'msg',        //错误上报msg前缀的key，用户上报系统接收存储msg
      otherReport: {              //需要上报的其他信息
        uin: 491862102
      },
      entry:"#entry" */        //请点击这个DOM元素6次召唤vConsole。//你可以通过AlloyLever.entry('#entry2')设置多个机关入口召唤神龙
    })
  }

  /**
   * 获取用户头像路径
   * @param avatarId
   */
  loadAvatarPath(avatarId) {
    return Observable.create(observer => {
      if (!avatarId) {
        observer.next(DEFAULT_AVATAR);
      } else {
        this.fileService.getFileInfoById(avatarId).subscribe((res: FileObj) => {
          if (res.origPath) {
            let avatarPath = res.origPath;
            observer.next(avatarPath);
          } else {
            observer.next(DEFAULT_AVATAR);
          }
        }, () => {
          observer.next(DEFAULT_AVATAR);
        })
      }
    });
  }

  /**
   * 登录成功处理
   */
  loginSuccessHandle(userInfo) {
    Utils.sessionStorageClear();//清除数据缓存
    this.globalData.user = userInfo;
    this.globalData.userId = userInfo.id;
    this.globalData.phone = userInfo.phone;
    this.storage.get('enabled-file-cache-' + userInfo.id).then(res => {//获取是否启用缓存文件
      if (res === false) {
        this.globalData.enabledFileCache = false;
      }
    });
    this.loadAvatarPath(userInfo.avatarId).subscribe(avatarPath => {//加载用户头像
      userInfo.avatarPath = avatarPath;
      this.globalData.user.avatarPath = avatarPath;
    });
    this.setTags();
    this.setAlias();
    this.events.publish('user:login', userInfo);
  }


  /**
   * 从文件对象数组中找出指定id对应的文件对象
   * @param fileList 文件对象数组
   * @param idList id数组
   */
  static findFileListById(fileList, ids) {
    if (!ids || ids.length == 0) {
      return [];
    }
    let newFileList = [];
    for (let file of fileList) {
      for (let id of ids) {
        if (file.id == id) {
          newFileList.push(file);
        }
      }
    }
    return newFileList;
  }

  /**
   * 上传文件返回文件id
   */
  uploadPictureByPath(fileList) {
    return Observable.create(observer => {
      if (!fileList || fileList.length == 0) {
        observer.next([]);
        return;
      }
      let fileIds = [];
      let uploadFileList = [];
      for (let fileObj of fileList) {
        if (fileObj.id) {
          fileIds.push(fileObj.id);
        } else {
          fileObj.parameter = fileObj.origPath;
          uploadFileList.push(fileObj);
        }
      }

      this.globalData.showLoading = false;
      this.fileService.uploadMultiByFilePath(uploadFileList).subscribe(fileList => {
        for (let fileObj of fileList) {
          fileIds.push(fileObj.id);
        }
        observer.next(fileIds);
      });

    })
  }

  /**
   * 极光推送
   */
  initJpush() {
    if (!this.nativeService.isMobile()) {
      return;
    }
    this.jPush.init();
    if (this.nativeService.isIos()) {
      this.jPush.setDebugModeFromIos();
    } else {
      this.jPush.setDebugMode(true);
    }

    this.jPushAddEventListener();
  }

  private jPushAddEventListener() {
    this.jPush.getUserNotificationSettings().then(result => {
      if (result == 0) {
        console.log('系统设置中已关闭应用推送');
      } else if (result > 0) {
        console.log('系统设置中打开了应用推送');
      }
    });

    //点击通知进入应用程序时会触发的事件
    document.addEventListener("jpush.openNotification", event => {
      this.setIosIconBadgeNumber(0);
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      console.log("jpush.openNotification" + content);
    }, false);

    //收到通知时会触发该事件
    document.addEventListener("jpush.receiveNotification", event => {
      let content = this.nativeService.isIos() ? event['aps'].alert : event['alert'];
      console.log("jpush.receiveNotification" + content);
    }, false);

    //收到自定义消息时触发这个事件
    document.addEventListener("jpush.receiveMessage", event => {
      let message = this.nativeService.isIos() ? event['content'] : event['message'];
      console.log("jpush.receiveMessage" + message);
    }, false);


    //设置标签/别名回调函数
    document.addEventListener("jpush.setTagsWithAlias", event => {
      console.log("onTagsWithAlias");
      let result = "result code:" + event['resultCode'] + " ";
      result += "tags:" + event['tags'] + " ";
      result += "alias:" + event['alias'] + " ";
      console.log(result);
    }, false);

  }

  //设置标签
  setTags() {
    if (!this.nativeService.isMobile()) {
      return;
    }
    let tags = [];
    if (this.nativeService.isAndroid()) {
      tags.push('android');
    }
    if (this.nativeService.isIos()) {
      tags.push('ios');
    }
    console.log('设置setTags:' + tags);
    this.jPush.setTags(tags);
  }

  //设置别名,一个用户只有一个别名
  setAlias() {
    if (!this.nativeService.isMobile()) {
      return;
    }
    console.log('设置setAlias:' + this.globalData.userId);
    this.jPush.setAlias('' + this.globalData.userId);//ios设置setAlias有bug,值必须为string类型,不能是number
  }

  setTagsWithAlias(userId) {
    if (!this.nativeService.isMobile()) {
      return;
    }
    console.log('设置setTagsWithAlias:' + userId);
    this.jPush.setTagsWithAlias(['man', 'test'], '' + userId);
  }

  //设置ios角标数量
  setIosIconBadgeNumber(badgeNumber) {
    if (this.nativeService.isIos()) {
      this.jPush.setBadge(badgeNumber);//上传badge值到jPush服务器
      this.jPush.setApplicationIconBadgeNumber(badgeNumber);//设置应用badge值
    }
  }

}
