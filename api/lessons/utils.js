import fs from 'fs';
import path from 'path';

export const getLessons = () => {

    var EXTENSION = '.json';
    
    const lessons = [];

    const files = fs.readdirSync('api/lessons').filter(file => path.extname(file).toLowerCase() === EXTENSION);
    
    files.forEach(file => {
        const lesson = JSON.parse(fs.readFileSync(`api/lessons/${file}`, 'utf8'));
        lessons.push(lesson);
    });

    return lessons;
};