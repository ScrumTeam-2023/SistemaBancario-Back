'use strict'

const Service = require('./addS.model')
const User = require('../user/user.model')
const Purchase = require('../purchase/purchase.model'); // Importa el modelo de Purchase


//Obtener todos los servicios
exports.getService = async(req, res) => {
    try {
        let service = await Service.find().populate();
        return res.send({ message: 'Services found', service });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting services' });
    }
};

//Obtener todos los sevicios por ID
exports.getServiceBy = async(req, res) => {
    try {
        let serviceId = req.params.id;
        let service = await Service.findById({ _id: serviceId })
        if (!service) return res.status(418).send({ message: 'Service not found' });
        return res.send(service)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting Service for ID' });
    }
}

// Create service
exports.createService = async(req, res) => {
    try {
        let data = req.body;
        // Validar Duplicados
        let existService = await Service.findOne({ name: data.name });
        if (existService) {
            return res.status(409).send({ message: 'Service already exist' });
        }
        let service = new Service(data);
        await service.save();
        return res.status(201).send({ message: 'Service created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error creating service' });
    }
}

//Actulaizar un servicio existente
exports.updateService = async(req, res) => {
    try {
        //Obtener el ID del servicio a actualizar
        const serviceId = req.params.id;

        //Obtener los datos del formulario  (body)
        const data = req.body;

        //Buscar si existe algúnn servicio con el mismo nombre
        const existingService = await Service.findOne({ name: data.name }).lean();

        if (existingService) {
            //Validar que el ID que llega tenga el mismo nombre del que va actualizar
            if (existingService.id != serviceId) {
                return res.send({ message: 'Service already created' });
            }
        }

        //Actualizar el servicio
        const updateService = await Service.findOneAndUpdate({ _id: serviceId },
            data, { new: true }
        );

        if (!updateService) {
            return res.status(404).send({ message: 'Service not found and not update' });
        }
        return res.send({ message: 'Service update', updateService })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating service' });
    }
};

//-------------EliminarServicio---------------------------

exports.deleteService = async(req, res) => {
    try {
        //Capturar el ID del Servicio
        let serviceId = req.params.id;
        //Eliminarlo
        let deleteService = await Service.deleteOne({ _id: serviceId })
        if (deleteService.deleteCount === 0) return res.status(404).send({ message: 'Service not found, not deleted' });
        return res.send({ message: 'Service deleted' })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting service' });
    }
}

//----------Adquirir un servicio---------------------


    exports.adquirirService = async (req, res) => {
    try {
        // Obtener el ID del servicio y el ID del usuario desde la solicitud
        const serviceId = req.params.id;
        const userId = req.user.sub;

        // Buscar el servicio y el usuario en la base de datos
        const service = await Service.findOne({ _id: serviceId });
        const user = await User.findOne({ _id: userId });

        if (!service) {
        return res.status(404).send({ message: 'Service not found' });
        }

        if (service.state === 'NO DISPONIBLE') {
        return res.status(400).send({ message: 'The service is not available at the moment' });
        }

        if (service.price > user.balance) {
        return res.status(400).send({ message: 'You do not have enough money to purchase this service' });
        }

        // Actualizar el balance del usuario
        await User.updateOne({ _id: userId }, { $inc: { balance: -service.price } });

        // Actualizar el contador de movimientos del usuario
        const newMovement = user.movements + 1;
        await User.findByIdAndUpdate(userId, { movements: newMovement });

        // Crear un objeto con los datos de la adquisición del servicio
        const purchaseData = {
        serviceId: service._id,
        serviceName: service.name,
        servicePrice: service.price,
        userName: user.username,
        userBalance: user.balance,
        date: new Date()
        };

        // Guardar la adquisición del servicio en la base de datos
        const purchase = new Purchase(purchaseData);
        await purchase.save();

        return res.send({ message: 'The service was successfully purchased', purchaseData });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error purchasing the service' });
    }
    };


//services mas add

exports.getMostPurchasedServices = async (req, res) => {
    try {
      // Obtener todas las adquisiciones de servicios
      const purchases = await Purchase.find();
  
      // Calcular la cantidad de veces que se ha adquirido cada servicio
      const serviceCounts = purchases.reduce((counts, purchase) => {
        const serviceId = purchase.serviceId.toString();
        counts[serviceId] = (counts[serviceId] || 0) + 1;
        return counts;
      }, {});
  
      // Obtener los IDs de los servicios ordenados por cantidad de adquisiciones (de mayor a menor)
      const sortedServiceIds = Object.keys(serviceCounts).sort(
        (a, b) => serviceCounts[b] - serviceCounts[a]
      );
  
      // Obtener los detalles de los servicios más adquiridos y agregar el contador de adquisiciones
      const mostPurchasedServices = await Service.find({ _id: { $in: sortedServiceIds } }).lean();
  
      // Agregar el contador de adquisiciones a cada servicio
      const servicesWithCount = mostPurchasedServices.map((service) => ({
        ...service,
        purchaseCount: serviceCounts[service._id.toString()] || 0,
      }));
  
      res.json(servicesWithCount);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los servicios más adquiridos' });
    }
  };
  
  