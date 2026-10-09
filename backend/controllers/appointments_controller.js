const { getDB } = require('../database');

exports.getAllAppointments = (req, res) => {
    const db = getDB();
    db.all("PRAGMA table_info(appointments)", (err, columns) => {
        if (err || !columns) return res.status(500).json({ error: "Database error" });
        const colNames = columns.map(c => c.name);

        const nameCol = colNames.includes('customer_name') ? 'customer_name' : (colNames.includes('name') ? 'name' : "''");
        const phoneCol = colNames.includes('customer_phone') ? 'customer_phone' : (colNames.includes('phone') ? 'phone' : "''");
        const notesCol = colNames.includes('notes') ? 'a.notes' : "''";
        const statusCol = colNames.includes('status') ? 'a.status' : "'pending'";
        const timeSlotCol = colNames.includes('time_slot') ? 'a.time_slot' : "''";
        const servicesListCol = colNames.includes('services_list') ? 'a.services_list' : "''";
        const createdAtCol = colNames.includes('created_at') ? 'a.created_at' : (colNames.includes('createdAt') ? 'a.createdAt' : "CURRENT_TIMESTAMP");

        const sql = `
            SELECT a.id, 
                   ${nameCol} as customer_name, 
                   ${phoneCol} as customer_phone, 
                   a.appointment_date, 
                   ${timeSlotCol} as time_slot, 
                   ${servicesListCol} as services_list, 
                   ${notesCol} as notes, 
                   ${statusCol} as status, 
                   ${createdAtCol} as created_at,
                   s.name as service_name 
            FROM appointments a
            LEFT JOIN services s ON a.service_id = s.id
            ORDER BY a.appointment_date DESC`;

        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });
};

exports.createAppointment = (req, res) => {
    const { customer_name, customer_phone, phone, service_id, services_list, appointment_date, time_slot, notes } = req.body;
    const db = getDB();
    const phoneNum = customer_phone || phone || '';
    const nameVal = customer_name || 'Khách Vô Danh';

    db.all("PRAGMA table_info(appointments)", (err, columns) => {
        if (err || !columns) return res.status(500).json({ error: "Database error checking schema" });
        
        const colNames = columns.map(c => c.name);
        const fields = [];
        const placeholders = [];
        const params = [];

        if (colNames.includes('customer_name')) {
            fields.push('customer_name');
            placeholders.push('?');
            params.push(nameVal);
        } else if (colNames.includes('name')) {
            fields.push('name');
            placeholders.push('?');
            params.push(nameVal);
        }

        if (colNames.includes('customer_phone')) {
            fields.push('customer_phone');
            placeholders.push('?');
            params.push(phoneNum);
        } else if (colNames.includes('phone')) {
            fields.push('phone');
            placeholders.push('?');
            params.push(phoneNum);
        }

        if (colNames.includes('service_id')) {
            fields.push('service_id');
            placeholders.push('?');
            params.push(service_id || null);
        }

        if (colNames.includes('services_list')) {
            fields.push('services_list');
            placeholders.push('?');
            params.push(services_list || '');
        }

        if (colNames.includes('appointment_date')) {
            fields.push('appointment_date');
            placeholders.push('?');
            params.push(appointment_date);
        }

        if (colNames.includes('time_slot')) {
            fields.push('time_slot');
            placeholders.push('?');
            params.push(time_slot || '');
        }

        if (colNames.includes('notes')) {
            fields.push('notes');
            placeholders.push('?');
            params.push(notes || '');
        }

        const sql = `INSERT INTO appointments (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;

        db.run(sql, params, function(err) {
            if (err) {
                console.error("Error inserting appointment:", err);
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({ id: this.lastID, customer_name: nameVal, customer_phone: phoneNum, appointment_date });
        });
    });
};

exports.updateAppointmentStatus = (req, res) => {
    const { status } = req.body;
    const db = getDB();
    db.run('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment status updated', changes: this.changes });
    });
};

exports.deleteAppointment = (req, res) => {
    const db = getDB();
    db.run('DELETE FROM appointments WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Appointment deleted', changes: this.changes });
    });
};
