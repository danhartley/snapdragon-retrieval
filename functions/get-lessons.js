const query = require("./utils/query");

const GET_LESSONS = `
    query {
        allLessons {
            data {
              title
              _id
            }
          }
    }
`;

exports.handler = async () => {
    const { data, errors } = await query(GET_LESSONS);
   
    if (errors) {
      return {
        statusCode: 500,
        body: JSON.stringify(errors)
      };
    }
   
    return {
      statusCode: 200,
      body: JSON.stringify({ lessons: data.allLessons.data })
    };
  };