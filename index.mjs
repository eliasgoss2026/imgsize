import{ Server as h1 } from 'http'; 
import x from 'express';
import Busboy from 'busboy';
import sizeOf from 'image-size';

const Router = x.Router();
const PORT = 12345;

const { log } = console;
const app = x();

  Router
  .route('/size2json')
  .get(r => r.res.end('Привет мир!'))
  .post(async (req, res) => {
    let o = {image: []};
    const boy = Busboy({ headers: req.headers });
    boy.on('file', (fieldname, file) => file
      .on('data', data => {
             if (fieldname == 'image') {
               o[fieldname].push(data);
             } 
       }));
    boy.on('finish', () => {
      o.image = Buffer.concat(o.image);
      let width, height;
      try {
        ({width, height} = sizeOf(o.image));
      } catch(e) {
        result = 'ERROR!';
      }      
 
      res
      .send(JSON.stringify({width, height}));
    });
    req.pipe(boy);
  });  

app
  .use('/', Router)
  .get('/login', (req, res) => res.send('1154202'))
  .use(({ res: r }) => r.status(404).send('Пока нет!'))
  .use((e, r, rs, n) => rs.status(500).send(`Ошибка: ${e}`))
  .set('view engine', 'pug')
  .set('x-powered-by', false);

export default h1(app)
  .listen(process.env.PORT || PORT, () => log(process.pid));
