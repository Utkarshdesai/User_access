const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Request',
  tableName: 'requests',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    userId: {
      type: 'int',
    },
    softwareId: {
      type: 'int',
    },
    accessType: {
      type: 'enum',
      enum: ['Read', 'Write', 'Admin'],
    },
    reason: {
      type: 'text',
    },
    status: {
      type: 'enum',
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId' }
    },
    software: {
      type: 'many-to-one',
      target: 'Software',
      joinColumn: { name: 'softwareId' }
    }
  }
});
