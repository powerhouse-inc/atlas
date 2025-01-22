import { useEnsAvatar, useEnsName } from "wagmi";
import { normalize } from "viem/ens";

type Props = {
  readonly address: `0x${string}`;
};

export const Avatar = (props: Props) => {
  const { address } = props;
  const result = useEnsName({ address });
  const name = result.data ? normalize(result.data) : undefined;
  const { data: avatar } = useEnsAvatar({ name });

  if (!avatar) return null;

  return <img alt={name} className="size-4 rounded-full" src={avatar} />;
};
