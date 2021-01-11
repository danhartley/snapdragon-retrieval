import fs from 'fs';
import path from 'path';

export const getLessons = () => {

    var EXTENSION = '.json';
    
    const lessons = [];

    let files = fs.readdirSync('api/lessons').filter(file => path.extname(file).toLowerCase() === EXTENSION);

    console.log(files);

    files = files.filter(file => file.indexOf('_ignore_') === -1);
    
    files.forEach(file => {
        const lesson = JSON.parse(fs.readFileSync(`api/lessons/${file}`, 'utf8'));
        lessons.push(lesson);
    });

    return lessons;
};