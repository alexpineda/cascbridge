# Command Center App For Black Sheep Wall

An http file server and UI for `CASC` archive data. Used for blacksheepwall.tv but can be used for any other prupose as well.

[Download, extract, and run the application](https://github.com/imbateam-gg/cascbridge/releases/tag/v1.0.0-tr), assign the port, assign your Starcraft directory and press `Start`. 

![image](https://user-images.githubusercontent.com/586716/192916637-3356b4a5-d224-45ad-b9e1-46dd70bedeec.png)



## Javascript Usage Example

```ts


const animBuffer = await fetch("http://localhost:8080/anim/main_000.anim").then(res => res.arrayBuffer());


```
