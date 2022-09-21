const { png2svg } = require("svg-png-converter");
const fs = require("fs")

const { writeFile } = require("node:fs/promises");

async function test() {
  let i = 0; 
  let resultSvg = ""
  while(i < 10) {
    const result = await png2svg({
      tracer: "bitmap2vector",
      optimize: true,
      input: fs.readFileSync(`chicken_images/${i}.png`),
      numberofcolors: 200,
      pathomit: 1,
    });
    console.log(result)
    resultSvg += result.content
    i += 1;
  }
  console.log(resultSvg)
}
console.log("hello")
test();