import esbuild from 'esbuild';
import fs from 'fs-extra';
import chalk from 'chalk';
import chokidar from 'chokidar';

const watch = process.argv.includes('--watch');

const esBuildOptions = {
    color: true,
    entryPoints: ["src/index.jsx"],
    loader: {".js": "jsx", ".json": "json", ".png": "file", ".jpeg": "file", ".jpg": "file", ".svg": "file"},
    outdir: "build",
    minify: !watch,
    platform: "node",
    bundle: true,
    sourcemap: watch,
    logLevel: "error",
    incremental: watch,
};

function cleanBuildDir() {
    console.log(chalk.blue('[esbuild] ') + ' Cleaning build folder ...  ')
    try {
        fs.removeSync("build");
    } catch (err) {
        console.error(err);
    }
}

function cleanBuild() {
    console.log(chalk.blue('[esbuild] ') + ' Building ...');
    return esbuild.build(esBuildOptions)
        .catch((e) => {
            console.log(chalk.red('[esbuild] ') + ' Build failed');
            console.log(e);
        });
}


if (watch) {
    cleanBuildDir();
    console.log(chalk.blue('[esbuild] ') + ' Watching for changes ...');
    let start = Date.now();
    let result = await cleanBuild()
    console.log(chalk.blue('[esbuild] ') + ' Build complete in ' + (Date.now() - start) + 'ms');

    chokidar.watch(['src/**/*'], {ignored: /(^|[\/\\])\../})
        .on('all', async (event, path) => {
            if (event === 'change') {
                console.log(chalk.blue('[esbuild] ') + ' Change detected in ' + path + ' ...');
                if (result) {
                    if (result.rebuild) {
                        result.rebuild().then(() => {
                            console.log(chalk.blue("[esbuild] ") + "Start rebuild")
                            console.time(chalk.blue("rebuild done"))
                            console.timeEnd(chalk.blue("rebuild done"))

                        })
                            .catch(e => {
                                console.time(chalk.red("rebuild failed"))
                                console.log(e);
                                console.timeEnd(chalk.red("rebuild failed"))
                            });
                    }
                } else {
                    console.log(chalk.blue('[esbuild] ') + ' Building ...')
                    console.time(chalk.blue("build done"))
                    result = await cleanBuild();
                    console.timeEnd(chalk.blue("build done"))
                }

            }
        })
} else {
    cleanBuildDir();
    console.log(chalk.blue('[esbuild] ') + ' Building ...');
    console.time(chalk.blue("build done"))
    await cleanBuild();
    console.timeEnd(chalk.blue("build done"))
    process.exit(0);
}
