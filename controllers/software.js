const Software = require('../entities/software');
const AppDataSource = require('../config/data-config');

const createSoftware = async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { name, description, accessLevels } = req.body;

    // Validate input
    if (!name || !description || !accessLevels) {
      return res.status(400).json({
        message: 'Name, description, and access levels are required'
      });
    }

    // Validate access levels
    const validAccessLevels = ['Read', 'Write', 'Admin'];
    const invalidLevels = accessLevels.filter(level => !validAccessLevels.includes(level));
    
    if (invalidLevels.length > 0) {
      return res.status(400).json({
        message: `Invalid access levels: ${invalidLevels.join(', ')}. Valid levels are: ${validAccessLevels.join(', ')}`
      });
    }

    const softwareRepository = AppDataSource.getRepository(Software);

    // Check if software with same name exists
    const existingSoftware = await softwareRepository.findOneBy({ name });
    if (existingSoftware) {
      return res.status(400).json({
        message: 'Software with this name already exists'
      });
    }

    // Create new software
    const newSoftware = softwareRepository.create({
      name,
      description,
      accessLevels
    });

    await softwareRepository.save(newSoftware);

    res.status(201).json({
      message: 'Software created successfully',
      data: newSoftware
    });

  } catch (error) {
    console.error('Create software error:', error);
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createSoftware
}; 