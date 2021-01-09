const axios = require("axios");
require("dotenv").config();
 
module.exports = async (query, variables) => {
  const result = await axios({
      url: "https://graphql.fauna.com/graphql",
      method: "POST",
      headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAUNA_KEY}`
      },
      data: {
        query,
        variables
      }
 });
 
 return result.data;
};