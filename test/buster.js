var config = module.exports;

config["chain tests"] = {
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
