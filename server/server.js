const express = require("express")
const {Pool} = require("pg")
const cors =  require("cors")

const app = express();
app.use(cors())

const PORT = 4000;

//PostgreSQL configuration
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "jenkinsdb",
    password: "181229@Rs",
    port: 5432,
  });

  app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`);
  });

  //creating api endponit
app.get("/data", async (req,res) => {
    try {
    const numberOfDays = req.query.days; // Default to 12 days if no parameter is provided
     
      const client = await pool.connect(); //connect to database
      const result = await client.query(`select met.testpass_name,ted.app,ted.pod,ted.jar,jjs.job_id,ted.class_name, jjs.job_status, jjs.creation_datetime,TO_CHAR(jjs.update_datetime-jjs.creation_datetime,'HH24:MI:SS') as duration
      from jenkins_job_status jjs
      join test_execution_details ted
      on jjs.test_exec_id=ted.test_exec_id
      join master_test_execution met
      on met.execution_id=ted.execution_id
      where jjs.creation_datetime >= current_date - interval '${numberOfDays} days'
      order by ted.class_name,duration`); //making query to get data
      client.release(); //connecion stopped.
      res.json(result.rows); //returning data

      console.log(result.rowCount);

    } catch (err) {
      console.error("Error executing query", err);//printing error
      res.status(500).json({ error: "Internal Server Error" });//returning error status
      console.log("in error");
    }
  });
  

