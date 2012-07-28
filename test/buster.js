var config = module.exports;

config["My tests"] = {
    rootPath: "../",
    environment: "node", // or "browser"
    sources: [
        "lib/mylib.js",
        "lib/**/*.js"
    ],
    tests: [
        "test/*-test.js"
    ]
}
