const TorrenteLogo = `
  ______                           __     
 /_  __/___  _____________  ____  / /____ 
  / / / __ \\/ ___/ ___/ _ \\/ __ \\/ __/ _ \\
 / / / /_/ / /  / /  /  __/ / / / /_/  __/
/_/  \\____/_/  /_/   \\___/_/ /_/\\__/\\___/ 
`

export const printHelloTag = () => {
    console.log("\x1b[32m", TorrenteLogo);
    console.log("===========================================");
    console.log("Created by Amazon Biobank Project");
    console.log("===========================================\x1b[0m");
}