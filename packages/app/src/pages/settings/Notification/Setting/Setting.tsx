import React from 'react'
import { Form, Switch, Input, Space, Button, Table, Modal } from 'antd'

import { RouteComponentProps, useModel } from '@/ability'
import type { NotificationSetting, NotificationSettingWebHook } from '@/models'
import { Icon, Zone } from '@/components'
import { useUpdateEffect, useBoolean, usePersistFn } from '@/hooks'
import { registerServiceWorker, askNotificationPermission } from '@/utils'

import EditWebhook from './EditWebhook'

import styles from './Setting.module.less'

const Setting: React.FC<RouteComponentProps> = () => {
  const notificationModel = useModel('notification')
  const appModel = useModel('app')
  const loadingModel = useModel('loading')
  const projectModel = useModel('project')
  const [form] = Form.useForm()
  const [currentRule, setCurrentRule] = React.useState<
    NotificationSettingWebHook | undefined
  >(undefined)
  const [currentSwitch, setCurrentSwitch] = React.useState<number>()
  const [browserDisabled] = React.useState<boolean>(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      return false
    }
    return true
  })

  React.useEffect(() => {
    notificationModel.dispatch.getSetting()
    // eslint-disable-next-line
  }, [projectModel.state.current])
  const setting = notificationModel.state.settingData
  const browserSwitchLoading =
    loadingModel.state.effects.notification.updateSetting
  const switchLoading =
    loadingModel.state.effects.notification.updateWebhooksSetting

  useUpdateEffect(() => {
    if (setting) {
      form.setFieldsValue({
        ...setting,
        browser: setting?.browser?.open,
      })
    }
  }, [setting])

  const [
    webhookModalVisible,
    { setTrue: webhookModalShow, setFalse: webhookModalOnCancel },
  ] = useBoolean(false)

  const handleBrowserChange = usePersistFn((checked: boolean) => {
    if (checked === true) {
      // 获取浏览器通知权限
      askNotificationPermission()
        .then(() => {
          registerServiceWorker().then((subscribeOptions) => {
            if (subscribeOptions) {
              notificationModel.dispatch.updateSetting({
                browser: {
                  open: checked,
                  data: JSON.parse(JSON.stringify(subscribeOptions)),
                },
              })
            }
          })
        })
        .catch((err) => {
          appModel.dispatch.error(err.message)
          form.setFieldsValue({
            browser: false,
          })
        })
    } else {
      notificationModel.dispatch.updateSetting({
        browser: {
          open: checked,
          data: null,
        },
      })
    }
  })
  const handleFinish = usePersistFn((values) => {
    const payload: NotificationSetting = {}
    if (form.isFieldTouched('emails')) {
      payload.emails = values.emails
      notificationModel.dispatch.updateSetting({
        ...payload,
      })
    }
  })

  return (
    <section className={styles.root}>
      <EditWebhook
        visible={webhookModalVisible}
        onCancel={webhookModalOnCancel}
        initialValues={currentRule}
      />
      <Form form={form} onFinish={handleFinish}>
        <Zone title="邮件通知">
          <Form.List name="emails">
            {(fields, operation) => (
              <Space direction="vertical">
                {fields.map((field, index) => (
                  <div className={styles.emailLine} key={field.key}>
                    <Space
                      style={{ width: 500 }}
                      align="center"
                      key={field.key}
                    >
                      <Form.Item
                        name={[field.name, 'email']}
                        hasFeedback
                        rules={[
                          { required: true, message: '请输入正确的邮箱格式' },
                          { type: 'email', message: '请输入正确的邮箱格式' },
                          { max: 100, message: '请输入正确的邮箱格式' },
                        ]}
                      >
                        <Input
                          maxLength={100}
                          onBlur={() => {
                            form.submit()
                          }}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <Button
                          onClick={() => {
                            const emails = form.getFieldValue('emails')
                            // 判断当前行是否输入内容
                            if (!emails[index].email) {
                              // 没有内容 直接删除行
                              operation.remove(field.name)
                            } else {
                              Modal.confirm({
                                title: '请确认是否删除?',
                                okText: '删除',
                                okType: 'danger',
                                cancelText: '取消',
                                onOk() {
                                  operation.remove(field.name)
                                  setTimeout(form.submit, 0)
                                },
                              })
                            }
                          }}
                          icon={
                            <Icon type="icon-ohbug-indeterminate-circle-line" />
                          }
                          type="text"
                          size="small"
                        />
                      ) : null}
                      {fields.length < 3 && index === fields.length - 1 && (
                        <Button
                          onClick={() => {
                            operation.add()
                          }}
                          icon={<Icon type="icon-ohbug-add-circle-line" />}
                          type="text"
                          size="small"
                        />
                      )}
                    </Space>
                    <Form.Item
                      className={styles.emailSwitch}
                      name={[field.name, 'open']}
                      valuePropName="checked"
                      initialValue
                    >
                      <Switch
                        onChange={() => {
                          form.submit()
                        }}
                      />
                    </Form.Item>
                  </div>
                ))}
                {fields.length === 0 && (
                  <Button
                    onClick={() => {
                      operation.add()
                    }}
                    icon={<Icon type="icon-ohbug-add-circle-line" />}
                    type="text"
                    size="small"
                  />
                )}
              </Space>
            )}
          </Form.List>
        </Zone>

        <Zone
          title={
            <div className={styles.browserLine}>
              <div style={{ width: 500 }}>浏览器通知</div>
              <Form.Item
                className={styles.browserSwitch}
                name="browser"
                initialValue={false}
                valuePropName="checked"
              >
                <Switch
                  loading={browserSwitchLoading}
                  onChange={handleBrowserChange}
                  disabled={browserDisabled}
                />
              </Form.Item>
            </div>
          }
        >
          <span>{browserDisabled ? `当前浏览器不支持浏览器通知` : ''}</span>
        </Zone>

        <Zone
          title="第三方通知"
          extra={
            <Button
              className={styles.addWebhook}
              icon={<Icon type="icon-ohbug-add-circle-line" />}
              type="text"
              onClick={() => {
                setCurrentRule(undefined)
                webhookModalShow()
              }}
            />
          }
        >
          <Form.Item name="webhooks" valuePropName="dataSource">
            <Table pagination={false} rowKey={(record) => record.id!}>
              <Table.Column
                title="名称"
                width={500}
                render={(item) => (
                  <span>
                    {/* <Avatar></Avatar> */}
                    <span>{item.name}</span>
                  </span>
                )}
              />
              <Table.Column
                title="开关"
                render={(item) => (
                  <Switch
                    checked={item.open}
                    loading={switchLoading && currentSwitch === item?.id}
                    onChange={(checked) => {
                      setCurrentSwitch(item?.id)
                      notificationModel.dispatch.updateWebhooksSetting({
                        id: item.id,
                        open: checked,
                      })
                    }}
                  />
                )}
              />
              <Table.Column
                title="操作"
                render={(item) => (
                  <span>
                    <Button
                      className={styles.editButton}
                      type="text"
                      size="small"
                      onClick={() => {
                        setCurrentRule(item)
                        webhookModalShow()
                      }}
                    >
                      修改
                    </Button>
                    <Button
                      className={styles.deleteButton}
                      type="text"
                      size="small"
                      onClick={() => {
                        Modal.confirm({
                          title: '请确认是否删除?',
                          content: item?.name,
                          okText: '删除',
                          okType: 'danger',
                          cancelText: '取消',
                          onOk() {
                            notificationModel.dispatch.deleteWebhooksSetting({
                              id: item?.id,
                            })
                          },
                        })
                      }}
                    >
                      删除
                    </Button>
                  </span>
                )}
              />
            </Table>
          </Form.Item>
        </Zone>
      </Form>
    </section>
  )
}

export default Setting
