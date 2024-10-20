import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as mysql from 'mysql2';

const app = express();

// MySQL connection configuration
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST_IP as string,
  user: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASSWORD as string,
  database: process.env.MYSQL_DATABASE as string,
  port: parseInt(process.env.MYSQL_PORT as string, 10),
});

db.connect((err: mysql.QueryError | null) => {
  if (err) {
    console.log('Database Connection Failed !!!', err);
  } else {
    console.log('Connected to Database');
  }
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json('Node.js Server');
});

app.get('/api/get', (req: Request, res: Response) => {
  const sqlGet = `SELECT
    cu.id AS courseId,
    cu.name AS courseName,
    cu.category AS courseCategory,
    JSON_ARRAYAGG(
        JSON_OBJECT('id', ch.id, 'name', ch.name)
    ) AS chapters
FROM
    Courses AS cu
JOIN
    Chapters AS ch ON ch.courseId = cu.id
GROUP BY
    cu.id;
`;
  db.query(sqlGet, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      res.send(result);
    }
  });
});

app.post('/api/post', (req: Request, res: Response) => {
  const { name, email, contact } = req.body;
  const sqlInsert =
    'INSERT INTO contact_db(name, email, contact) VALUES(?,?,?)';
  db.query(sqlInsert, [name, email, contact], (error) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error inserting data');
    } else {
      res.send('Data successfully inserted');
    }
  });
});

app.delete('/api/remove/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const sqlRemove = 'DELETE FROM contact_db WHERE id=?';
  db.query(sqlRemove, id, (error) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error deleting data');
    } else {
      res.send(`Record with id ${id} successfully deleted`);
    }
  });
});

app.get('/api/get/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const sqlGet = 'SELECT * FROM contact_db WHERE id = ?';
  db.query(sqlGet, id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving data');
    } else {
      res.send(result);
    }
  });
});

app.put('/api/update/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, contact } = req.body;
  const sqlUpdate =
    'UPDATE contact_db SET name=?, email=?, contact=? WHERE id=?';
  db.query(sqlUpdate, [name, email, contact, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error updating data');
    } else {
      res.send(result);
    }
  });
});

// Start the server
app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});
