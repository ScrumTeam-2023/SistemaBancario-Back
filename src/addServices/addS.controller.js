'use strict'

const Service = require('./addS.model')

//Obtener todos los servicios
exports.getService = async (req, res)=>{
    try{
        let service = await Service.find().populate();
        return res.send({message: 'Services found', service});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting services'});
    }
};

//Obtener todos los sevicios por ID
exports.getServiceBy = async(req, res)=>{
    try{
        let serviceId = req.params.id;
        let service = await Service.findById({_id: serviceId})
        if(!service) return res.status(418).send({message: 'Service not found'});
        return res.send(service)
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting Service for ID'});
    }
}

// Create service
exports.createService = async(req, res)=>{
    try{
        let data = req.body;
        // Validar Duplicados
        let existService = await Service.findOne({name: data.name});
        if(existService){
            return res.status(409).send({message: 'Service already exist'});
        }
        let service = new Service(data);
        await service.save();
        return res.status(201).send({message: 'Service created successfully'});
    }catch(error){
        console.error(error);
        return res.status(500).send({message:'Error creating service'});
    }
}

//Actulaizar un servicio existente
exports.updateService = async (req, res) =>{
    try{
        //Obtener el ID del servicio a actualizar
        const serviceId = req.params.id;
        
        //Obtener los datos del formulario  (body)
        const data = req.body;

        //Buscar si existe algúnn servicio con el mismo nombre
         const existingService = await Service.findOne({ name: data.name}).lean();
        
         if(existingService){
            //Validar que el ID que llega tenga el mismo nombre del que va actualizar
            if(existingService.id != serviceId){
                return res.send({ message: 'Service already created'});
            }
         }

         //Actualizar el servicio
         const updateService = await Service.findOneAndUpdate(
           { _id: serviceId},
           data,
           { new: true}
        );
        
        if (!updateService){
            return res.status(404).send({ message: 'Service not found and not update'});
        }
        return res.send({ message: 'Service update', updateService})
    }catch(err){
        console.error(err);
        return res.status(500).send({ message: 'Error updating service'});
    }
};

//-------------EliminarServicio---------------------------

exports.deleteService = async(req, res)=>{
    try{
        //Capturar el ID del Servicio
        let serviceId = req.params.id;
        //Eliminarlo
        let deleteService = await Service.deleteOne({_id: serviceId})
        if(deleteService.deleteCount === 0)return res.status(404).send({message: 'Service not found, not deleted'});
        return res.send({message: 'Service deleted'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting service'});
    }
}
