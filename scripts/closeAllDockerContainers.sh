# containers=`docker ps|awk 'NR>1{print $1}'`
containers=`docker ps -q`

if [ -n "$containers" ] 
then 
    docker stop $containers
fi