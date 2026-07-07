import bpy
import os
import sys
import shutil
from mathutils import Vector

try:
    argv = sys.argv
    target_assets_dir = argv[argv.index("--") + 1]
except (ValueError, IndexError):
    target_assets_dir = os.path.join(os.path.dirname(bpy.data.filepath), "assets")

CAMERA_LOCATION = (5.0, -5.0, 7.0) 
LOOK_AT_POINT = (0.0, 0.0, 0.0) 
ORTHO_SCALE = 25.0 
RESOLUTION_X = 1000
RESOLUTION_Y = 1000

def create_folder_structure(base_dir):
    dirs = {
        "icons": os.path.join(base_dir, "icons"),
        "obj": os.path.join(base_dir, "furniture", "obj"),
        "mtl": os.path.join(base_dir, "furniture", "mtl"),
        "symbols": os.path.join(base_dir, "symbols")
    }
    for path in dirs.values():
        os.makedirs(path, exist_ok=True)
    return dirs

def setup_scene_base():
    bpy.context.scene.render.resolution_x = RESOLUTION_X
    bpy.context.scene.render.resolution_y = RESOLUTION_Y
    bpy.context.scene.render.resolution_percentage = 100
    bpy.context.scene.render.film_transparent = True
    bpy.context.scene.render.image_settings.file_format = 'PNG'
    bpy.context.scene.render.image_settings.color_mode = 'RGBA'

def render_icon(blend_name, icons_dir):
    if "IconCamera" not in bpy.data.objects:
        cam_data = bpy.data.cameras.new("IconCamera")
        cam_obj = bpy.data.objects.new("IconCamera", cam_data)
        bpy.context.collection.objects.link(cam_obj)
    else:
        cam_obj = bpy.data.objects["IconCamera"]

    cam_obj.location = CAMERA_LOCATION
    direction = Vector(LOOK_AT_POINT) - Vector(CAMERA_LOCATION)
    cam_obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

    bpy.context.scene.camera = cam_obj
    bpy.context.scene.render.filepath = os.path.join(icons_dir, f"{blend_name}.png")
    bpy.ops.render.render(write_still=True)

def render_symbol(blend_name, symbols_dir):
    scene = bpy.context.scene
    
    if "SymbolCamera" not in bpy.data.objects:
        sym_cam_data = bpy.data.cameras.new("SymbolCamera")
        sym_cam_data.type = 'ORTHO'
        sym_cam_obj = bpy.data.objects.new("SymbolCamera", sym_cam_data)
        bpy.context.collection.objects.link(sym_cam_obj)
    else:
        sym_cam_obj = bpy.data.objects["SymbolCamera"]
        sym_cam_data = sym_cam_obj.data
        
    sym_cam_data.ortho_scale = ORTHO_SCALE
    sym_cam_obj.location = (0.0, 0.0, 10.0) 
    sym_cam_obj.rotation_euler = (0.0, 0.0, 0.0) 
    scene.camera = sym_cam_obj

    if "HoldoutOverride" not in bpy.data.materials:
        mat_holdout = bpy.data.materials.new("HoldoutOverride")
        mat_holdout.use_nodes = True
        mat_holdout.node_tree.nodes.clear()
        node_holdout = mat_holdout.node_tree.nodes.new(type='ShaderNodeHoldout')
        node_out = mat_holdout.node_tree.nodes.new(type='ShaderNodeOutputMaterial')
        mat_holdout.node_tree.links.new(node_holdout.outputs[0], node_out.inputs[0])
    else:
        mat_holdout = bpy.data.materials["HoldoutOverride"]

    old_override = bpy.context.view_layer.material_override
    bpy.context.view_layer.material_override = mat_holdout

    old_freestyle = scene.render.use_freestyle
    scene.render.use_freestyle = True
    scene.render.line_thickness = 2.0
    
    fs_settings = bpy.context.view_layer.freestyle_settings
    fs_settings.use_culling = True
    
    if not fs_settings.linesets:
        lineset = fs_settings.linesets.new("SymbolLines")
    else:
        lineset = fs_settings.linesets[0]
        
    lineset.select_silhouette = True
    lineset.select_border = True
    lineset.select_crease = True
    
    if not lineset.linestyle:
        lineset.linestyle = bpy.data.linestyles.new("SymbolLineStyle")
    lineset.linestyle.color = (0.0, 0.0, 0.0) 

    scene.render.filepath = os.path.join(symbols_dir, f"{blend_name}.png")
    bpy.ops.render.render(write_still=True)

    bpy.context.view_layer.material_override = old_override
    scene.render.use_freestyle = old_freestyle

def export_obj_mtl(blend_name, obj_dir, mtl_dir):
    obj_path = os.path.join(obj_dir, f"{blend_name}.obj")
    mtl_source = os.path.join(obj_dir, f"{blend_name}.mtl")
    mtl_dest = os.path.join(mtl_dir, f"{blend_name}.mtl")
    
    bpy.ops.wm.obj_export(filepath=obj_path, export_materials=True, global_scale=0.7)
    
    if os.path.exists(mtl_source):
        shutil.move(mtl_source, mtl_dest)
        try:
            with open(obj_path, 'r', encoding='utf-8') as f:
                content = f.read()
            content = content.replace(f"mtllib {blend_name}.mtl", f"mtllib ../mtl/{blend_name}.mtl")
            with open(obj_path, 'w', encoding='utf-8') as f:
                f.write(content)
        except Exception:
            pass

def main():
    blend_filepath = bpy.data.filepath
    blend_name = os.path.basename(blend_filepath).replace(".blend", "")
    
    dirs = create_folder_structure(target_assets_dir)
    setup_scene_base()
    
    render_icon(blend_name, dirs["icons"])
    render_symbol(blend_name, dirs["symbols"])
    export_obj_mtl(blend_name, dirs["obj"], dirs["mtl"])

if __name__ == "__main__":
    main()