import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {File} from "@ionic-native/file";
import {FileTransfer, FileTransferObject} from "@ionic-native/file-transfer";
import {AlertController} from "ionic-angular";
import {Logger} from "./Logger";
import {APP_VERSION_SERVE_URL, FILE_SERVE_URL} from "./Constants";
import {Utils} from "./Utils";
import {HttpService} from "./HttpService";
import {NativeService} from "./NativeService";
import {FileService} from "./FileService";

@Injectable()
export class VersionService {
  appName;//如app id为com.kit.ionic2tabs,则appName为ionic2tabs
  appType;//android 或 ios
  currentVersionNo;//当前版本号
  latestVersionNo;//最新版本号
  lastVersionInfo;//从后台获取到的app最新版本信息
  versions;//app更新日志

  isMobile = false;//是否移动端

  appDownloadPageUrl;//下载页访问地址
  apkUrl;//android apk地址

  //app更新进度.默认为0,在app升级过程中会改变
  updateProgress: number = -1;

  isInit: boolean = true; //是否正在初始化

  constructor(public nativeService: NativeService,
              public transfer: FileTransfer,
              public file: File,
              public httpService: HttpService,
              public fileService: FileService,
              public alertCtrl: AlertController,
              public logger: Logger) {

  }

  init() {
    this.isMobile = this.nativeService.isMobile();
    if (this.isMobile) {

      this.nativeService.getVersionNumber().subscribe(currentVersionNo => {
        this.currentVersionNo = currentVersionNo;
      });

      this.nativeService.getPackageName().subscribe(packageName => {
        this.appName = packageName.substring(packageName.lastIndexOf('.') + 1);
        this.appType = this.nativeService.isAndroid() ? 'android' : 'ios';

        this.appDownloadPageUrl = FILE_SERVE_URL + '/static/download.html?name=' + this.appName;

        //从后台查询app最新版本信息
        let url = Utils.formatUrl(`${APP_VERSION_SERVE_URL}/v1/apply/getDownloadPageByEName/${this.appName}/${this.appType}`);
        this.httpService.get(url).subscribe(res => {
          this.isInit = false;//初始化完成
          if (res && res.code == 1 && res.data && res.data.lastVersion) {
            let data = res.data;
            this.lastVersionInfo = data.lastVersion;
            this.latestVersionNo = data.lastVersion.version;
            for (let fileRelation of data.fileRelationList) {
              if (fileRelation.type == 'apk') {
                this.fileService.getFileInfoById(fileRelation.fileId).subscribe(res => {
                  this.apkUrl = res.origPath;
                })
              }
            }
          }
        }, err => {
          this.logger.log(err, '从版本升级服务获取版本信息失败', {url: url});
          this.isInit = false;//初始化完成
        })
      });
    }
  }

  getCurrentVersionNo() {
    return this.currentVersionNo;
  }

  getLatestVersionNo() {
    return this.latestVersionNo;
  }

  getLastVersionInfo() {
    return this.lastVersionInfo;
  }

  /**
   * 是否需要升级
   */
  assertUpgrade() {
    if (this.isMobile) {
      if (this.isInit) {
        setTimeout(() => {
          this.assertUpgrade();
        }, 5000);
      } else {
        if (this.latestVersionNo && (this.currentVersionNo != this.latestVersionNo)) {
          let that = this;
          if (this.lastVersionInfo.isForcedUpdate == 1) {//判断是否强制更新
            this.alertCtrl.create({
              title: '重要升级',
              subTitle: '您必须升级后才能使用！',
              enableBackdropDismiss: false,
              buttons: [{
                text: '确定', handler: () => {
                  that.downloadApp();
                }
              }
              ]
            }).present();
          } else {
            this.alertCtrl.create({
              title: '升级',
              subTitle: '发现新版本,是否立即升级？',
              enableBackdropDismiss: false,
              buttons: [{text: '取消'}, {
                text: '确定', handler: () => {
                  that.downloadApp();
                }
              }]
            }).present();
          }
        }
      }
    }
  }

  /**
   * 下载app
   */
  downloadApp() {
    if (this.nativeService.isIos()) {//ios打开网页下载
      this.nativeService.openUrlByBrowser(this.appDownloadPageUrl);
    }
    if (this.nativeService.isAndroid()) {//android本地下载
      if (!this.apkUrl) {
        this.nativeService.alert('未找到android apk下载地址');
        return;
      }
      this.nativeService.externalStoragePermissionsAuthorization().subscribe(() => {
        let backgroundProcess = false;//是否后台下载
        let alert = this.alertCtrl.create({//显示下载进度
          title: '下载进度：0%',
          enableBackdropDismiss: false,
          buttons: [{
            text: '后台下载', handler: () => {
              backgroundProcess = true;
            }
          }
          ]
        });
        alert.present();
        const fileTransfer: FileTransferObject = this.transfer.create();
        const apk = this.file.externalRootDirectory + 'download/' + `android_${Utils.getSequence()}.apk`; //apk保存的目录
        //下载并安装apk
        fileTransfer.download(this.apkUrl, apk).then(() => {
          window['install'].install(apk.replace('file://', ''));
        }, err => {
          this.updateProgress = -1;
          alert && alert.dismiss();
          this.logger.log(err, 'android app 本地升级失败');
          this.alertCtrl.create({
            title: '前往网页下载',
            subTitle: '本地升级失败',
            buttons: [{
              text: '确定', handler: () => {
                this.nativeService.openUrlByBrowser(this.appDownloadPageUrl);//打开网页下载
              }
            }
            ]
          }).present();
        });

        let timer = null;//由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
        fileTransfer.onProgress((event: ProgressEvent) => {
          let progress = Math.floor(event.loaded / event.total * 100);//下载进度
          this.updateProgress = progress;
          if (!backgroundProcess) {
            if (progress === 100) {
              alert && alert.dismiss();
            } else {
              if (!timer) {
                timer = setTimeout(() => {
                  clearTimeout(timer);
                  timer = null;
                  let title = document.getElementsByClassName('alert-title')[0];
                  title && (title.innerHTML = `下载进度：${progress}%`);
                }, 1000);
              }
            }
          }
        });
      })
    }
  }

  /**
   * 检查是否需要更新
   */
  checkNewVersion() {
    if (this.updateProgress == -1 || this.updateProgress == 100) {
      if (this.currentVersionNo != this.latestVersionNo) {
        this.assertUpgrade();
      } else {
        this.nativeService.alert('已经是最新版本');
      }
    } else {//正在更新
      let alert = this.alertCtrl.create({
        title: `下载进度：${this.updateProgress}%`,
        buttons: [{text: '后台下载'}]
      });
      alert.present();
      let interval = setInterval(() => {
        alert.setTitle(`下载进度：${this.updateProgress}%`);
        if (this.updateProgress == 100) {
          clearInterval(interval);
          alert && alert.dismiss();
        }
      }, 1000);
    }
  }

  /**
   * 查询app更新日志
   */
  getVersionList() {
    if (this.isMobile) {
      let url = Utils.formatUrl(`${APP_VERSION_SERVE_URL}/v1/apply/findVersionList/${this.appName}/${this.appType}`);
      return this.httpService.get(url).map(res => {
        if (res && res.code == 1) {
          return res.data.versions || [];
        }
      })
    } else {
      return Observable.of([]);
    }
  }

}
