const input_file_name = process.argv[2];
const output_file_name = process.argv[3];

const fs = require('fs');

const output_tip = () => {
  console.log(fs.readFileSync('./readme.md', 'utf8'));
  process.exit(-1);
}  

if (!(input_file_name && output_file_name)) 
  output_tip();

for (i = 2; i < 4; i++) {
  const file_name = process.argv[i];
  if (!fs.existsSync(file_name)) {
    console.warn('Возникла ошибка при доступе к файлу "%s"', file_name);
    process.exit(-1);
  }
}

const pattern = new RegExp("[a-zA-Z \n]");
const stream = fs.createReadStream(input_file_name);
const writeStream = fs.createWriteStream(output_file_name);

let arr = [];
let acc = {};

  stream.on('data', (data) => {
    try {
      let newParams = "";
      let _data = data.toString();
      for (let i = 0; i < _data.length; i++) {
        if (pattern.test(_data[i]))
          newParams += _data[i].toLowerCase();
      }
      newParams.replaceAll(' ', '\n');
      arr = newParams.split('\n');
      arr.sort();
      arr.forEach((el ) => {
        if (acc.hasOwnProperty(el) )
          acc[el] = acc[el] + 1;
        else 
          acc[el] = 1;
      })
      throw(new Error())
      writeStream.write(Object.values(acc).toString());
      writeStream.end();
    }
    catch (ex) { 
      console.log("Возникло необработанное исключение: ", ex);
      process.exit(-1);    
    }

    finally {
      if (!writeStream.closed)
        writeStream.close();
    }
    // console.log(data.toString())
  });

console.log("Выполнение программы завершено");