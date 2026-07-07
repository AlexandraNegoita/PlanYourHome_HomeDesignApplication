"use strict";
// import { Parser } from '../planner/model/Parser';
// const fileInput = document.getElementById('fileInput') as HTMLInputElement;
// fileInput.addEventListener('change', handleFileSelect);
// let parser = new Parser();
// function handleFileSelect(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (!input.files) return;
//     const file = input.files[0];
//     const reader = new FileReader();
//     console.log("upload");
//     reader.onload = (e) => {
//         try {
//             const jsonString = e.target?.result as string;
//             //const jsonObject = JSON.parse(jsonString);
//             parser.readJSON(jsonString);
//             parser.printJSON();
//             console.log("citit");
//             //console.log(JSON.stringify(jsonObject, null, 2));
//         } catch (err) {
//             console.log(`Error parsing JSON: ${err}`);
//         }
//     };
//     reader.readAsText(file);
// }
