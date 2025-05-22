'use client'

import { User } from '@/db/schema/users'
import { http } from '@/utils/http.client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function Home() {
  const queryClient = useQueryClient()
  const { data: users, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await http.get('/api/user')
      return res.data as User[]
    },
  })

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const res = await http.delete(`/api/user/${id}`)
      return res.data
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
  })

  return (
    <>
      <Link href="profile">个人中心</Link>

      <h1>用户列表</h1>

      {isPending && <p>Loading...</p>}

      <ol className="pl-8 list-decimal">
        {users?.map((user) => (
          <li key={user.id} className="flex gap-2">
            <span>{user.email}</span>
            <button onClick={() => mutate(user.id)}>删除</button>
          </li>
        ))}
      </ol>
    </>
  )
}
