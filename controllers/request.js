const Request = require('../entities/request');
const Software = require('../entities/software');
const AppDataSource = require('../config/data-config');

// Create new access request (Employee)
const createRequest = async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { softwareId, accessType, reason } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!softwareId || !accessType || !reason) {
      return res.status(400).json({
        message: 'Software ID, access type, and reason are required'
      });
    }

    const requestRepository = AppDataSource.getRepository(Request);
    const softwareRepository = AppDataSource.getRepository(Software);

    // Check if software exists
    const software = await softwareRepository.findOneBy({ id: softwareId });
    if (!software) {
      return res.status(404).json({
        message: 'Software not found'
      });
    }

    // Check if user already has a pending request for this software
    const existingRequest = await requestRepository.findOne({
      where: {
        user: { id: userId },
        software: { id: softwareId },
        status: 'Pending'
      }
    });

    if (existingRequest) {
      return res.status(400).json({
        message: 'You already have a pending request for this software'
      });
    }

    // Create new request
    const newRequest = requestRepository.create({
      user: { id: userId },
      software: { id: softwareId },
      accessType,
      reason
    });

    await requestRepository.save(newRequest);

    res.status(201).json({
      message: 'Access request submitted successfully',
      data: newRequest
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all requests (Manager)
const getRequests = async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const requestRepository = AppDataSource.getRepository(Request);
    const requests = await requestRepository.find({
      relations: ['user', 'software'],
      order: {
        createdAt: 'DESC'
      }
    });

    res.status(200).json({
      data: requests
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update request status (Manager)
const updateRequestStatus = async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Valid status (Approved/Rejected) is required'
      });
    }

    const requestRepository = AppDataSource.getRepository(Request);
    const request = await requestRepository.findOne({
      where: { id },
      relations: ['user', 'software']
    });

    if (!request) {
      return res.status(404).json({
        message: 'Request not found'
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        message: 'Request has already been processed'
      });
    }

    request.status = status;
    await requestRepository.save(request);

    res.status(200).json({
      message: `Request ${status.toLowerCase()} successfully`,
      data: request
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus
}; 