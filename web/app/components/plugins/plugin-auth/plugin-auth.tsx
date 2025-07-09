import { memo } from 'react'
import Authorize from './authorize'
import Authorized from './authorized'
import { useAppContext } from '@/context/app-context'
import { useGetPluginToolCredentialInfo } from '@/service/use-plugins-auth'
import { CredentialTypeEnum } from './types'

type PluginAuthProps = {
  provider?: string
  children?: React.ReactNode
}
const PluginAuth = ({
  provider = '',
  children,
}: PluginAuthProps) => {
  const { data } = useGetPluginToolCredentialInfo(provider)
  const { isCurrentWorkspaceManager } = useAppContext()
  const isAuthorized = !!data?.credentials.length
  const canOAuth = data?.supported_credential_types.includes(CredentialTypeEnum.OAUTH2)
  const canApiKey = data?.supported_credential_types.includes(CredentialTypeEnum.API_KEY)

  return (
    <>
      {
        !isAuthorized && (
          <Authorize
            provider={provider}
            canOAuth={canOAuth}
            canApiKey={canApiKey}
            disabled={!isCurrentWorkspaceManager}
          />
        )
      }
      {
        isAuthorized && !children && (
          <Authorized
            provider={provider}
            credentials={data?.credentials}
            canOAuth={canOAuth}
            canApiKey={canApiKey}
            disabled={!isCurrentWorkspaceManager}
          />
        )
      }
      {
        isAuthorized && children
      }
    </>
  )
}

export default memo(PluginAuth)
