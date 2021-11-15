const db = require('./../config/connection');
const options =require('./../config/knex');
const knex = require('knex')(options);
const Role = require('./../models/Role');
const RolePermission = require('./../models/RolePermission');
const { validationResult } = require('express-validator');

exports.RolesGet = async(req, res) => {
    try {
        const roles = await knex.select('*').from('_role as r');
        res.json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los roles'});
    }
}

exports.RolesGetByUser = async(req, res) => {
    try {
        const roles = await knex.select('*').from('_role as r')
        .innerJoin('_userrole as ur', 'ur.RoleId', '=', 'r.RoleId')
        .where('ur.UserId','=',req.params.UserId);
        res.json(roles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error al encontrar los roles del usuario'});
    }
}

exports.RoleCreate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            let rolePermissionVec = [];
            const rol = new Role(req.body);
            await rol.save({transaction: t});
            for (let i=0; i<= req.body.PermisosSeleccionados.length-1; i++){
                let obj = {
                    RoleId: user.RoleId,
                    PermissionId: req.body.PermisosSeleccionados[i]
                }
                rolePermissionVec.push(obj);
                const rolePermission = new RolePermission(obj);
                await rolePermission.save({transaction: t});
            }
            return res.status(200).json({msg: 'El Rol ha sido registrado correctamente'})
        })
        }   
    catch (error) {
        console.log(error)
        res.status(400).json({msg: 'Hubo un error al registrar el Rol'});
    }
}

exports.RoleUpdate = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        await db.transaction(async(t)=>{
            let rolePermissionVec = [];
            const rol = await Role.findByPk( req.body.RoleId, {transaction: t} );
            if(req.body.PermisosSeleccionados.length !== 0){
                //eliminamos los permisos que tiene actualmente el rol
                await RolePermission.destroy({where: {
                    RoleId: req.body.RoleId
                }}, {transaction: t});
                //creamos los nuevos permisos
                for (let i=0; i<= req.body.PermisosSeleccionados.length-1; i++){
                    let obj = {
                        RoleId: req.body.RoleId,
                        PermissionId: req.body.PermisosSeleccionados[i].PermissionId
                    }
                    rolePermissionVec.push(obj);
                    const nuevoRolePermission = new RolePermission(obj);
                    nuevoRolePermission.save({transaction: t});
                }
            }
            await rol.update(req.body, {transaction: t});
            return res.status(200).json({msg: 'El Rol ha sido modificado correctamente'})
        })
        }   
    catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Hubo un error al modificar el Rol'});
    }
}
exports.RoleDelete = async(req, res) => {
    try {
        await db.transaction(async(t)=>{
            const rol = await Role.findByPk( req.body.RoleId, {transaction: t} );
            await rol.save({transaction: t});
            return res.status(200).json({msg: 'El Rol ha sido eliminado correctamente'})
        })
    }   
    catch (error) {
        res.status(400).json({msg: 'Hubo un error al eliminar el Rol'});
    }
}