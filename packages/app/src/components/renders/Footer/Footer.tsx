import React from 'react'
import { Button, Popover } from 'antd'

import { Image } from '@/components'
import logo from '@/static/logo.svg'

import qrcode from './images/wechatQrcode.jpg'
import styles from './Footer.module.less'

const Footer: React.FC = () => (
  <div className={styles.root}>
    <a
      className={styles.logo}
      href="https://ohbug.net"
      target="_blank"
      rel="noreferrer"
    >
      <Image src={logo} alt="logo" />
    </a>
    <div className={styles.right}>
      <Button
        className={styles.link}
        type="link"
        href="https://ohbug.net/docs"
        target="_blank"
      >
        Docs
      </Button>
      <Button
        className={styles.link}
        type="link"
        href="https://github.com/ohbug-org/ohbug"
        target="_blank"
      >
        Github
      </Button>

      <Popover
        placement="topRight"
        arrowPointAtCenter
        content={
          <div>
            <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 500 }}>
              关注公众号反馈您的问题
            </div>
            <img
              style={{ width: 200, height: 200 }}
              src={qrcode}
              alt="wechat qrcode"
            />
          </div>
        }
      >
        {/* eslint-disable-next-line no-script-url */}
        <Button className={styles.link} type="link" href="javascript:void(0)">
          Feedback
        </Button>
      </Popover>
    </div>
  </div>
)

export default Footer
