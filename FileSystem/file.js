var fs = require('fs');

var path = "./msg.txt";
//readFile("./msg.txt");
//copy(path, "./msg2.txt");
//fs.rmdirSync("./subdir");
//delDir("./subdir");
//modifyCss("./");
fs.rename('./test1.txt','d:/msg.txt',function(err){
    if(err){
       console.log(err);  
    }else{
       console.log('renamed complete');
     }
})

function readFile(src) {
	fs.readFile(src, "utf-8", function(err, data) {
		if (err) throw err;
		console.log(data);
	})
}

function writeFile(dst, src) {
	var buf;
	buf = fs.readFileSync(src, 'utf-8');
	fs.writeFileSync(dst);
}

function writeFileStream(dst, src) {
	var rOption = {
		flags: 'r',
		encoding: null,
		mode: 0666
	}
	var wOption = {
		flags: 'a',
		encoding: null,
		mode: 0666
	}
	var fileReadStream = fs.createReadStream(src, rOption);
	var fileWriteStream = fs.createWriteStream(dst, wOption);

	//fileReadStream.pipe(fileWriteStream);
	//或
	fileReadStream.on("data", function(data) {
		fileWriteStream.write(data);
	});

	fileReadStream.on("end", function() {
		console.log("end");
		fileWriteStream.end();
	});
}

function copy(src, dst) {
	if (fs.statSync(src).isDirectory()) {
		var dstlist = dst.split('/'),
			tmpPath = '';
		for (var d = 0, dr; dr = dstlist[d++];) {
			tmpPath += dr + '/';
			if (!fs.existsSync(tmpPath))
				fs.mkdirSync(tmpPath, 0755);
		}
		fs.readdirSync(src).forEach(function(name) {
			var tsrc = src + '/' + name;
			var tdst = dst + '/' + name;
			if (fs.statSync(tsrc).isDirectory()) {
				copy(tsrc, tdst)
			} else {
				writeFileStream(tdst, tsrc)
			}
		});
	} else {
		writeFileStream(dst, src);
	}
}

function move(src, dst) {
	if (!fs.statSync(src).isDirectory()) {
		writeFileStream(dst, src);
		fs.unlinkSync(src);
	} else {
		var dstlist = dst.split('/'),
			tmpPath = '';
		for (var d = 0, dr; dr = dstlist[d++];) {
			tmpPath += dr + '/';
			if (!fs.existsSync(tmpPath))
				fs.mkdirSync(tmpPath, 0755);
		}
		if (fs.statSync(src).isDirectory()) {
			var filelist = fs.readdirSync(src);

			for (var i = 0, ci; ci = filelist[i++];) {
				var tsrc = src + '/' + ci;
				var tdst = dst + '/' + ci;
				if (excludeFn && excludeFn(ci)) {
					continue;
				}
				if (fs.statSync(tsrc).isDirectory()) {
					move(tsrc, tdst)
				} else {
					writeFileStream(tdst, tsrc);
					fs.unlinkSync(tsrc);
				}
			}
		}
	}
}


function delDir(path) {
	if (fs.statSync(path).isDirectory()) {
		fs.readdirSync(path).forEach(function(subpath) {
			subpath = path + '/' + subpath;
			if (fs.statSync(subpath).isFile()) {
				try {
					fs.unlinkSync(subpath)
				} catch (e) {}
			} else {
				del(subpath)
			}
		});
		fs.rmdirSync(path)
	}
}

function modifyCss(path) {
	if (fs.statSync(path).isDirectory()) {
		fs.readdirSync(path).forEach(function(subpath){
			console.log(subpath);
			subpath = path + '/' + subpath;
			//if (fs.statSync(subpath).isDirectory()) {
				//fs.readFileSync(subpath, 'utf-8', function(data){
				//	fs.writeFileSync(subpath, data);
				//});
			//}
		});
	};
}
