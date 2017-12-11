export class AppConfig {
    public static getBaseUrl() {
        return "http://localhost:3001";
    }
    //获取设备高度
    public static getWindowHeight() {
        return window.screen.height;
    }
    //获取设备宽度
    public static getWindowWidth() {
        return window.screen.width;
    }
}