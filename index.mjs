import { Server } from "http"; 
import { writeFileSync } from "fs";
import Busboy from "busboy"; // "busboy": "^1.6.0"
import sizeOf from "image-size";

Server((req, res) => {
	
	const { headers } = req;
	headers['Content-Type'] = headers['content-type'];
	
    console.log ('===NEW REQUEST AT ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()); 
    console.log (req.method + ' ' + req.url); console.log (req.headers) ;
    console.log('===================');
	
	
	if (req.url == '/login') return res.end('x');
	
    let o = { image: [] };
    const boy = { on(){} }; // Busboy({ headers });
	
    boy.on('file', (fieldname, file) => file
      .on('data', data => {
             if (fieldname == 'image') {
               o[fieldname].push(data);
             } 
       }));
    boy.on('finish', () => {
      o.image = Buffer.concat(o.image);
	  
	  writeFileSync('./im' + Math.random() + '.png', o.image);
      let width, height;
      try {
        ({width, height} = sizeOf(o.image));
      } catch(e) {
		console.log(e);  
        return res.end('ERROR!');
      }      
      res
      .end(JSON.stringify({width, height}));
    });
	
	res.end('ok'); req.pipe(boy);
})

.listen(process.env.PORT);
