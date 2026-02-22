import Task from "../model/taskModel.js";

export async function createTask(req, res) {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === 'Yes' || completed === true || false,
      owner: req.user._id
    });
    await task.save();
    res.status(201).json({ success: true, message: 'Task created successfully', task });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getTasks(req, res) {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getTaskById(req, res) {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateTask(req, res) {
  try {
    const data = { ...req.body };
    if (data.completed !== undefined) {
      data.completed = data.completed === 'Yes' || data.completed === true || false;
    }
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      data,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task updated successfully', task: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteTask(req, res) {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}