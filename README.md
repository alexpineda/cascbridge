# CASCBridge - Starcraft Local Asset Server

An http file server and UI for `CASC` archive data. Used for blacksheepwall.tv but can be used for any other prupose as well.

[Download, extract, and run the application](https://github.com/imbateam-gg/cascbridge/releases/tag/v1.0.0-tr), assign the port, assign your Starcraft directory and press `Start`. 

![image](https://github.com/alexpineda/cascbridge/assets/586716/03f5b7ba-b183-426e-8cba-8f89ea3848e6)


## Javascript Usage Example

```ts


const animBuffer = await fetch("http://localhost:8080/anim/main_000.anim").then(res => res.arrayBuffer());


```
