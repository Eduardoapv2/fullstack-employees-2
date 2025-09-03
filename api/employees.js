import express from "express";
const router = express.Router();
export default router;

// TODO: this file!
import {
  getEmployee,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "#db/queries/employees";

router
  .route("/")
  .get(async (req, res) => {
    const employees = await getEmployees();
    res.send(employees);
  })
  .post(async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send("Request must have a body.");
      }

      const { name, birthday, salary } = req.body;
      console.log(req.body);
      if (!name || !birthday || !salary) {
        return res
          .status(400)
          .send("Name, birthday and salary have to be provided.");
      }

      const employee = await createEmployee(name, birthday, salary);
      res.status(201).send(employee);
    } catch (error) {
      res.status(500).send("Server error:" + error.message);
    }
  });
router.param("id", async (req, res, next, id) => {
  if (!/^\d+$/.test(id) || Number(id) < 0) {
    return res.status(400).send("ID must be a positive integer.");
  }
  if (Number(id) === 0) {
    return res.status(404).send("Unexistent employee.");
  }
  const employee = await getEmployee(id);
  if (!employee) return res.status(404).send("Unexistent employee.");
  req.employee = employee;
  next();
});
router
  .route("/:id")
  .get((req, res) => {
    res.send(req.employee);
  })
  .put(async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).send("Request must have a body.");
      }

      const { name, birthday, salary } = req.body;
      console.log(req.body);
      if (!name || !birthday || !salary) {
        return res
          .status(400)
          .send("Name, birthday and salary have to be provided.");
      }
      const employee = await updateEmployee({
        id: req.employee.id,
        name,
        birthday,
        salary,
    });
      res.send(employee);
    } catch (error) {
      res.status(500).send("Server error:" + error.message);
    }
  })
  .delete(async (req, res) => {
    await deleteEmployee(req.employee.id);
    return res.sendStatus(204);
  });
