import G6 from "@antv/g6/build/g6"
import { uniqueId } from '@/utils'
import Shape from '@antv/g/src/shapes'
import okSvg from '@/assets/icons/ok.svg'
import loadingSvg from '@/assets/icons/loading.svg'
import store from "@/store"
const customNode = {
  init() {
    G6.registerNode("customNode", {
      draw(cfg, group) {
        let size = cfg.size
        if (!size) {
          size = [170, 34]
        }
        // 此处必须是NUMBER 不然bbox不正常
        const width = parseInt(size[0])
        const height = parseInt(size[1])
        const color = cfg.color
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2
        const offsetY = -height / 2
        store.dispatch('app/uniqueId')
        const mainId = 'rect' + store.state.app.max_id
        const shape = group.addShape("rect", {
          attrs: {
            id: mainId,
            x: offsetX,
            y: offsetY,
            width: width,
            height: height,
            stroke: "#ced4d9",
            fill: '#fff',//此处必须有fill 不然不能触发事件
            radius: 4
          }
        })
        group.addShape("rect", {
          attrs: {
            x: offsetX,
            y: offsetY,
            width: 4,
            height: height,
            fill: color,
            parent: mainId,
            radius: [4, 0, 0, 4]
          }
        })
        group.addShape("image", {
          attrs: {
            x: offsetX + 16,
            y: offsetY + 8,
            width: 20,
            height: 16,
            img: cfg.image,
            parent: mainId
          }
        })
        if (cfg.status) {
          group.addShape("image", {
            attrs: {
              x: offsetX + width - 32,
              y: offsetY + 8,
              width: 16,
              height: 16,
              parent: mainId,
              img: cfg.status == 'complete' ? okSvg : cfg.status == 'loading' ? loadingSvg : ''
            }
          })
        }
        if (cfg.backImage) {
          const clip = new Shape.Rect({
            attrs: {
              x: offsetX,
              y: offsetY,
              width: width,
              height: height,
              fill: '#fff',
              radius: 4
            }
          })
          group.addShape("image", {
            attrs: {
              x: offsetX,
              y: offsetY,
              width: width,
              height: height,
              img: cfg.backImage,
              clip: clip
            }
          })
        }
        cfg.node_detail.forEach(detail => {
          if (detail.name == 'name') {
            store.dispatch('app/uniqueId')
            group.addShape('text', {
              attrs: {
                id: 'label' + store.state.app.max_id,
                x: offsetX + width / 2,
                y: offsetY + height / 2,
                textAlign: "center",
                textBaseline: "middle",
                text: detail.value,
                parent: mainId,
                fill: "#565758"
              }
            })
          }
        })
        if (cfg.point_detail) {
          cfg.point_detail.forEach(point => {
            let x, y = 0
            if (point.type === 'input') {
              // 添加入度
              y = 0
              x = width * point.proportion
              store.dispatch('app/uniqueId')
              const outId = store.state.app.max_id
              store.dispatch('app/uniqueId')
              const id = point.id ? point.id : 'circle' + store.state.app.max_id
              group.addShape('circle', {
                attrs: {
                  id: 'circle' + outId,
                  parent: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 10,
                  isInPointOut: true,
                  func: point.func,
                  fill: '#1890ff',
                  opacity: 0
                }
              })
              group.addShape("circle", {
                attrs: {
                  id: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 3,
                  isInPoint: true,
                  func: point.func,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              })
              // todo 有两个circle
              point.id = id
            } else if (point.type === 'output') {
              // 添加出度
              y = height
              x = width * point.proportion
              store.dispatch('app/uniqueId')
              const outId = store.state.app.max_id
              store.dispatch('app/uniqueId')
              const id = point.id ? point.id : 'circle' + store.state.app.max_id
              group.addShape("circle", {
                attrs: {
                  id: 'circle' + outId,
                  parent: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 10,
                  isOutPointOut: true,
                  func: point.func,
                  fill: "#1890ff",
                  opacity: 0//默認0 需要時改成0.3
                }
              })
              group.addShape('text', {
                attrs: {
                  size: 12,
                  parent: id,
                  x: x + offsetX,
                  y: y + offsetY + 15,
                  isOutPointText: true,
                  textAlign: 'center',
                  textBaseline: 'bottom',
                  text: point.name,
                  fill: '#1890ff',
                  opacity: 0
                }
              })
              group.addShape("circle", {
                attrs: {
                  id: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 3,
                  isOutPoint: true,
                  func: point.func,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              })
              point.id = id
            }
          })
        }
        return shape
      },
      //设置状态
      setState(name, value, item) {
        const group = item.getContainer()
        const shape = group.get("children")[0] // 顺序根据 draw 时确定

        const children = group.findAll(g => {
          return g._attrs.parent === shape._attrs.id
        })
        const circles = group.findAll(circle => {
          return circle._attrs.isInPoint || circle._attrs.isOutPoint
        })
        const selectStyles = () => {
          shape.attr("fill", "#f3f9ff")
          shape.attr("stroke", "#6ab7ff")
          shape.attr("cursor", "move")
          children.forEach(child => {
            child.attr("cursor", "move")
          })
          circles.forEach(circle => {
            circle.attr('opacity', 1)
          })
        }
        const unSelectStyles = () => {
          shape.attr("fill", "#fff")
          shape.attr("stroke", "#ced4d9")
          circles.forEach(circle => {
            circle.attr('opacity', 0)
          })
        }
        switch (name) {
          case "selected":
          case "hover":
            if (value) {
              selectStyles()
            } else {
              unSelectStyles()
            }
            break
        }
      }
    })
  }
}

export default customNode
