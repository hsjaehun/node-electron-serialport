const { app: electronApp } = require("electron");
const express = require("express");
const app = express();
const { SerialPort } = require("serialport");

// ls /dev/tty.*  : to check all the connected ports.

function createLocalServer() {
   // 1 Channel USB Relay - 10A
   // http://vctec.co.kr/product/detail.html?product_no=14806&cate_no=117&display_group=1&cafe_mkt=naver_ks&mkt_in=Y&ghost_mall_id=naver&ref=naver_open&NaPm=ct%3Dlavx3qwo%7Cci%3D6a8cb8b60f29d4e1db94cacfd2b7277b5475e0f8%7Ctr%3Dsls%7Csn%3D246260%7Chk%3D2b3948a561c04ab628611a5959bbd5f1613a8698
   const port = new SerialPort({
      path: "/dev/tty.usbserial-14420",
      baudRate: 9600,
   });
   app.get("/", async (req, res) => {
      // turn on
      const turnOn = [0xa0, 0x01, 0x01, 0xa2];
      const turnOff = [0xa0, 0x01, 0x00, 0xa1];
      port.write(turnOn);
      // turn off after 2 secs
      await new Promise(() => {
         setTimeout(() => {
            port.write(turnOff);
         }, 2000);
      });
   });
   app.listen(3003);
}
electronApp.on("ready", () => {
   createLocalServer();
});
