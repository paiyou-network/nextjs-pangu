import React from 'react'
import { message, Dropdown, Menu } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { post, httpDelete } from '../utils/request'
import { roomsRemove } from '../redux/modules/rooms'

const quitRooms = async id => {
  const res = await post('rooms/quit_room', { id })
  return res
}

const deleteRooms = async id => {
  const res = await httpDelete(`rooms/${id}`)
  return res
}

const Rooms = ({ rooms, roomId }) => {
  const self = useSelector(s => s.self)
  const dispatch = useDispatch()

  const menu = id => (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() =>
          deleteRooms(id).then(body => {
            if (body.ok === false) {
              message.info('you are not the room owner')
            } else {
              dispatch(roomsRemove(body.id))
            }
          })
        }
      >
        删除房间
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() =>
          quitRooms(id).then(body => {
            dispatch(roomsRemove(body.id))
          })
        }
      >
        退出房间
      </Menu.Item>
    </Menu>
  )

  return (
    <Menu selectedKeys={roomId} className="TA-L PL-10" style={{ background: '#3f0e40', color: 'white' }}>
      {rooms
        .map(v => {
          const { id, title } = v.toJS()
          return (
            <Menu.Item key={id}>
              <Dropdown overlay={menu(id)} trigger={['contextMenu']}>
                <Link href={`/client/${self.get('id')}/${id}`}>{title}</Link>
              </Dropdown>
            </Menu.Item>
          )
        })
        .toList()}
    </Menu>
  )
}
export default Rooms
